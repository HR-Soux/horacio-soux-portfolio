import {createSections} from './sections.js?v=20261108c';
import {createEntrance} from './entrance.js?v=20261108c';
import {createCharacters} from './rigged-characters.js';
import * as THREE from 'three';



const names=['Background','Experience','Work','Projects','Merch','Mag'];
const intro='brand & communication specialist, crafting bold and emotionally resonant messages across disciplines.';
document.querySelector('#categories').innerHTML=names.map((n,i)=>`<button class="category" data-section="${i}"><span>${n}${i===3?' <em>(In progress)</em>':i>3?' <em>(coming soon)</em>':''}</span><small>${String(i+1).padStart(2,'0')}</small></button>`).join('');
const dialog=document.querySelector('#search');
function showInfo(title,copy){document.querySelector('.background-details')?.remove();document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;dialog.showModal()}
document.querySelector('#search-open').onclick=()=>showInfo('Horacio Soux',intro);
const schedule=document.querySelector('#schedule'),scheduleForm=document.querySelector('#schedule-form');
const draftKey='hrsoux-schedule-draft';
try{const saved=JSON.parse(localStorage.getItem(draftKey)||'null');if(saved)for(const key of ['name','email','date','project'])scheduleForm.elements.namedItem(key).value=saved[key]||'';}catch{}
document.querySelector('#schedule-open').onclick=()=>schedule.showModal();
scheduleForm.addEventListener('submit',event=>{
 event.preventDefault();
 const draft=Object.fromEntries(new FormData(scheduleForm));
 try{localStorage.setItem(draftKey,JSON.stringify(draft));}catch{}
 const subject='Portfolio inquiry — '+draft.name;
 const body=`Name: ${draft.name}\nEmail: ${draft.email}\nPreferred date: ${draft.date||'Not specified'}\n\n${draft.project||''}`;
 document.querySelector('#schedule-status').textContent='Opening your email app. Please send the message there; no meeting has been booked.';
 window.location.href='mailto:h.soux13@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});

dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;const motion=document.querySelector('#motion');function motionLabel(){document.body.classList.toggle('motion-paused',paused);motion.textContent=paused?'▷':'Ⅱ';motion.setAttribute('aria-label',paused?'Play animation':'Pause animation')}motionLabel();motion.onclick=()=>{paused=!paused;motionLabel()};reduced.addEventListener('change',e=>{paused=e.matches;motionLabel()});
const sections=createSections({showInfo,schedule,reduced});
const entrance=createEntrance();
let targetScroll=0;
let pointer={x:0,y:0},smooth={x:0,y:0},scroll=0;window.addEventListener('pointermove',e=>{pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2});window.addEventListener('pointerleave',()=>pointer={x:0,y:0});window.addEventListener('wheel',e=>{if(!sections.active&&!dialog.open&&!schedule.open)targetScroll=THREE.MathUtils.clamp(targetScroll+e.deltaY*.0003,0,1)},{passive:true});
let touchY=null;
window.addEventListener('touchstart',e=>{if(!e.target.closest('button,input,dialog,.rig-panel'))touchY=e.touches[0].clientY},{passive:true});
window.addEventListener('touchmove',e=>{if(touchY!==null&&!sections.active&&!dialog.open&&!schedule.open){const y=e.touches[0].clientY;targetScroll=THREE.MathUtils.clamp(targetScroll+(touchY-y)*.0015,0,1);touchY=y;}},{passive:true});
window.addEventListener('touchend',()=>touchY=null);
window.addEventListener('keydown',e=>{if(sections.active||e.target.closest('input,textarea,button,dialog'))return;if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key)){e.preventDefault();targetScroll=e.key==='Home'?0:e.key==='End'?1:THREE.MathUtils.clamp(targetScroll+(['ArrowDown','PageDown'].includes(e.key)?.08:-.08),0,1);}});
const dust=document.querySelector('#dust'),ctx=dust.getContext('2d');let particles=Array.from({length:44},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.1+.25,p:Math.random()*6.28}));let elapsed=0,last=performance.now(),start=performance.now(),mixer,clip,model,camera,renderer,bg,updateCustom;const scene=new THREE.Scene();
// Keep enough painting beyond the viewport for the existing cursor parallax.
function frameBackground(){
 if(!bg||!camera)return;
 const distance=6.45+1.1-bg.position.z;
 const viewHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*distance;
 const plane=bg.geometry.parameters;
 const scale=Math.max(.86,viewHeight*camera.aspect*1.12/plane.width,viewHeight*1.12/plane.height);
 bg.scale.setScalar(scale);
 // Lower the painting slightly to reveal more of its upper sky.
 const verticalMargin=(plane.height*scale-viewHeight)/2;
 bg.position.y=-Math.min(1.3,Math.max(0,verticalMargin-.5));
}
function resize(){dust.width=innerWidth;dust.height=innerHeight;if(renderer){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<900?39:25;camera.updateProjectionMatrix();frameBackground()}}
entrance.draw(performance.now());
// The interface must remain available while large 3D assets load.
const sceneHost=document.querySelector('#scene');
const painting=new URLSearchParams(location.search).has('original')?'./assets/background-integrated.lossless.webp':innerWidth<=900?'./assets/background-mobile.webp':'./assets/background-desktop.webp';
sceneHost.style.backgroundImage=`url("${painting}")`;sceneHost.style.backgroundSize='cover';sceneHost.style.backgroundPosition='center';
const releaseEntrance=()=>{document.querySelector('#scene').classList.add('ready');entrance.ready();};
const loadingDeadline=setTimeout(releaseEntrance,8000);
let charactersAppeared=null;
async function initializeScene(){try{
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;document.querySelector('#scene').appendChild(renderer.domElement);
 camera=new THREE.PerspectiveCamera(25,innerWidth/innerHeight,.1,100);camera.position.set(0,0,6.45);resize();
 model=new THREE.Group();scene.add(model);
 createCharacters(scene).then(update=>{updateCustom=update;charactersAppeared=performance.now();updateCustom(0,0,0);}).catch(error=>console.error('Characters could not load; navigation remains available',error));
 const texture=await new THREE.TextureLoader().loadAsync(painting);
 // User-supplied full-resolution painting, with the sky already integrated.
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
 texture.magFilter=THREE.LinearFilter;
 texture.minFilter=THREE.LinearMipmapLinearFilter;
 const skyMaterial=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
 bg=new THREE.Mesh(new THREE.PlaneGeometry(42,42*texture.image.height/texture.image.width),skyMaterial);
 bg.position.z=-25.46;scene.add(bg);frameBackground();

 renderer.render(scene,camera);
 start=performance.now();clearTimeout(loadingDeadline);releaseEntrance();
}catch(error){clearTimeout(loadingDeadline);releaseEntrance();console.error('3D scene unavailable; showing the painting fallback',error)}}
initializeScene();
window.addEventListener('resize',resize);resize();document.querySelector('#replay').onclick=()=>{if(sections.replay())return;start=performance.now();scroll=0;targetScroll=0;elapsed=0;entrance.replay();paused=false;motionLabel();const frame=document.querySelector('.frame');frame.style.animation='none';requestAnimationFrame(()=>frame.style.animation='')};
function tick(now){requestAnimationFrame(tick);let dt=Math.min((now-last)/1000,.05);last=now;if(!paused)elapsed+=dt;
 sections.update(pointer.x,pointer.y,dt,paused);
 const enter=entrance.draw(now),ease=1-Math.pow(1-enter,3);
 if(!paused)scroll+=(targetScroll-scroll)*(1-Math.exp(-dt*7));
 ctx.clearRect(0,0,dust.width,dust.height);for(const p of particles){const y=(p.y+elapsed*.004)%1;ctx.fillStyle=`rgba(255,235,163,${(.25+.22*Math.sin(elapsed+p.p))})`;ctx.beginPath();ctx.arc(p.x*dust.width+Math.sin(elapsed*.3+p.p)*10,y*dust.height,p.r,0,Math.PI*2);ctx.fill()}
 if(renderer&&model){if(!paused){smooth.x+=(pointer.x-smooth.x)*.035;smooth.y+=(pointer.y-smooth.y)*.035;camera.position.z=6.45+(1-ease)*1.1-scroll*.7;camera.position.x=smooth.x*.22;camera.position.y=-smooth.y*.08;camera.rotation.y=smooth.x*.014;camera.rotation.x=smooth.y*.007;}
 if(updateCustom)updateCustom(elapsed,scroll,Math.min(ease,Math.min(1,(now-charactersAppeared)/1200)));renderer.render(scene,camera);}
 const frame=document.querySelector('.frame');frame.style.transform=`translate(-50%,-50%) scale(${1-scroll*.06})`;
 document.body.dataset.scroll=scroll.toFixed(3);
}requestAnimationFrame(tick);
