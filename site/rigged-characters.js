import {MeshoptDecoder} from './vendor/jsm/libs/meshopt_decoder.module.js';
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// Experimental bind-pose skeletons. Joint locations follow the supplied posed meshes.
const layouts={
 falcon:[
 ['hips',-1,[-.04,-.035,0]],['spine',0,[.02,.10,0]],['chest',1,[.04,.22,0]],['neck',2,[.11,.27,0]],['head',3,[.13,.34,0]],
 ['armL',2,[0,.22,.18]],['forearmL',5,[-.21,.19,.19]],['handL',6,[-.37,.18,.18]],['fingersL',7,[-.46,.18,.18]],
 ['armR',2,[.07,.20,-.18]],['forearmR',9,[.14,.07,-.20]],['handR',10,[.29,.10,-.23]],['fingersR',11,[.36,.11,-.24]],
 ['thighL',0,[0,-.07,.13]],['shinL',13,[.19,-.16,.18]],['footL',14,[.23,-.34,.20]],['toeL',15,[.29,-.40,.25]],
 ['thighR',0,[-.05,-.06,-.12]],['shinR',17,[-.13,-.24,-.15]],['footR',18,[-.29,-.24,-.15]],['toeR',19,[-.34,-.32,-.16]]
 ],
 sun:[
 ['hips',-1,[.04,-.035,0]],['spine',0,[.10,.08,0]],['chest',1,[.12,.19,0]],['neck',2,[.12,.28,0]],['head',3,[.12,.36,0]],
 ['armL',2,[.04,.20,0]],['forearmL',5,[-.18,.16,0]],['handL',6,[-.34,.23,.02]],['fingersL',7,[-.43,.25,.02]],
 ['armR',2,[.20,.17,0]],['forearmR',9,[.29,.02,0]],['handR',10,[.37,.10,.02]],['fingersR',11,[.43,.12,.02]],
 ['thighL',0,[-.02,-.06,0]],['shinL',13,[-.20,-.21,.02]],['footL',14,[-.33,-.38,.02]],['toeL',15,[-.40,-.45,.02]],
 ['thighR',0,[.11,-.08,-.03]],['shinR',17,[.32,-.23,-.04]],['footR',18,[.10,-.33,-.03]],['toeR',19,[.09,-.40,0]]
 ]};
async function buildRig(gltf,key){
 let source;gltf.scene.traverse(o=>{if(o.isMesh)source=o});
 const geometry=source.geometry.clone();
 if(key==='sun')geometry.rotateY(-Math.PI/2);
 const layout=layouts[key], points=layout.map(x=>new T.Vector3(...x[2]));
 const bones=layout.map((j,i)=>{const b=new T.Bone();b.name=key+'_'+j[0];b.position.copy(points[i]);if(j[1]>=0)b.position.sub(points[j[1]]);return b});
 layout.forEach((j,i)=>{if(j[1]>=0)bones[j[1]].add(bones[i])});
 const segments=layout.map((j,i)=>{let child=layout.findIndex((c,k)=>c[1]===i&&k!==5&&k!==9&&k!==13&&k!==17);let end=child<0?points[i].clone().add(new T.Vector3(0,.025,0)):points[child];return [points[i],end,new T.Vector3().subVectors(end,points[i])];});
 const positions=geometry.attributes.position,indices=geometry.getAttribute('_rig_index')?.array||new Uint16Array(positions.count*4),weights=geometry.getAttribute('_rig_weight')?.array||new Float32Array(positions.count*4),v=new T.Vector3(),delta=new T.Vector3();
 let maxError=0;
 for(let n=0;!geometry.hasAttribute('_rig_index')&&n<positions.count;n++){
  v.fromBufferAttribute(positions,n);
  if(n%24000===0)await new Promise(requestAnimationFrame);
  if(v.y>.295){indices[n*4]=4;weights[n*4]=1;continue;}
  const ranked=[];
  for(let i=0;i<segments.length;i++){
   const [a,b,d]=segments[i];let t=T.MathUtils.clamp(delta.subVectors(v,a).dot(d)/Math.max(d.lengthSq(),1e-8),0,1);
   let dist=delta.copy(a).addScaledVector(d,t).distanceToSquared(v);
   // Local bone envelopes: broad torso, narrower limbs, soft four-weight blend.
   const radius=i<3?.105:i<5?.065:(i>=13?.09:.075);
   ranked.push([i,dist/(radius*radius)]);
  }
  ranked.sort((a,b)=>a[1]-b[1]);
  // Blend only within the nearest anatomical chain and its attachment.
  // Prevent nearby folded legs and crossing sleeves pulling each other.
  const nearest=ranked[0][0];
  const chain=nearest<5?[0,1,2,3,4]:nearest<9?[1,2,5,6,7,8]:nearest<13?[1,2,9,10,11,12]:nearest<17?[0,13,14,15,16]:[0,17,18,19,20];
  const local=ranked.filter(([i])=>chain.includes(i));ranked.splice(0,ranked.length,...local);
  let sum=0;
  for(let k=0;k<4;k++){indices[n*4+k]=ranked[k][0];weights[n*4+k]=Math.exp(-(ranked[k][1]-ranked[0][1])*2.8);sum+=weights[n*4+k];}
  for(let k=0;k<4;k++)weights[n*4+k]/=sum;
 }
 geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
 const material=new T.MeshBasicMaterial({map:source.material.map,side:T.DoubleSide});
 const mesh=new T.SkinnedMesh(geometry,material);mesh.add(bones[0]);mesh.bind(new T.Skeleton(bones));mesh.frustumCulled=false;
 mesh.updateMatrixWorld(true);mesh.skeleton.update();
 let bindError=0,weightError=0;const probe=new T.Vector3(),rest=new T.Vector3();
 for(let n=0;n<positions.count;n+=503){rest.fromBufferAttribute(positions,n);probe.copy(rest);mesh.applyBoneTransform(n,probe);bindError=Math.max(bindError,probe.distanceTo(rest));let sum=0;for(let k=0;k<4;k++)sum+=weights[n*4+k];weightError=Math.max(weightError,Math.abs(1-sum));}
 if(bindError>0.00001||weightError>0.00001)throw new Error('Invalid bind pose: '+key);
 const group=new T.Group();group.add(mesh);
 const helper=new T.SkeletonHelper(mesh);helper.material.depthTest=false;helper.renderOrder=50;helper.visible=false;
 return {group,bones,mesh,helper,key,bindError,weightError};
}
export async function createCharacters(scene){
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder),characters=[];
 const keys=['sun','falcon'];
 const loaded=await Promise.all(keys.map(key=>loader.loadAsync('./assets/'+key+'-optimized.glb')));
 for(const [index,key] of keys.entries()){
  const rig=await buildRig(loaded[index],key);
  rig.group.position.set(key==='sun'?-2.5:2.45,key==='sun'?-.35:.4,-7.09);
  rig.group.scale.setScalar(key==='sun'?4.4:4.4);
  if(key==='falcon')rig.group.scale.x*=-1;
  scene.add(rig.group);scene.add(rig.helper);characters.push(rig);
 }
 const active=true;
 // Authored, reversible pose beats: rest, reach, suspension, settle.
 const poses=[
 [0,0,0,0,0,0,0,0,0,0],
 [.018,-.025,.055,-.075,-.04,.065,.025,-.055,-.03,.05],
 [-.018,.035,-.035,.055,.055,-.07,-.03,.06,.025,-.05],
 [.012,-.015,.025,-.04,-.025,.035,.015,-.025,-.015,.025]
 ];
 const joints=[1,3,5,6,9,10,13,14,17,18];
 return function update(time,scroll,entrance=1){
  const intensity=1;
  const progress=T.MathUtils.clamp(scroll,0,1);
  const segment=Math.min(2,Math.floor(progress*3)),fraction=progress*3-segment;
  const blend=fraction*fraction*(3-2*fraction);
  for(const c of characters){
   const side=c.key==='sun'?-1:1;
   c.bones.forEach(b=>b.rotation.set(0,0,0));
   c.group.position.x=(c.key==='sun'?-2.5:2.45)+side*((1-entrance)*3.8+Math.sin(progress*Math.PI)*.22);
   c.group.position.y=(c.key==='sun'?-.35:.4)+(1-entrance)*.65+(active?Math.sin(time*.65+side*.6)*.035:0)+Math.sin(progress*Math.PI)*.12;
   c.group.rotation.z=side*((1-entrance)*.12+Math.sin(progress*Math.PI*2)*.025);
   c.group.rotation.y=side*Math.sin(progress*Math.PI)*.045;
   if(!active)continue;
   joints.forEach((bone,i)=>{c.bones[bone].rotation.z=((poses[segment][i]*(1-blend)+poses[segment+1][i]*blend)+Math.sin(time*.65+side*.6)*.004)*intensity;});
  }
 };
}
