// A real loading gate followed by an organic luminous reveal.
export function createEntrance(){
 const canvas=document.createElement('canvas');canvas.id='entrance';document.body.append(canvas);
 const label=document.createElement('div');label.id='loading-label';label.setAttribute('role','status');label.innerHTML='<span>The<br>H.R. Soux<br>Design studio</span><small aria-label="cargando"><span aria-hidden="true">cargando<i>.</i><i>.</i><i>.</i></span></small>';document.body.append(label);
 const ctx=canvas.getContext('2d');let began=null;
 function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}resize();window.addEventListener('resize',resize);
 document.body.classList.add('loading');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function draw(now){
  const t=began===null?0:Math.max(0,(now-began)/1000),p=began===null?0:Math.min(1,t/(reduced?.35:2.4));
  const w=innerWidth,h=innerHeight;ctx.clearRect(0,0,w,h);ctx.fillStyle='#080a09';
  if(p===0){ctx.fillRect(0,0,w,h);return 0}
  const radius=Math.hypot(w,h)*.62*Math.pow(p,1.15),points=[];
  for(let i=0;i<=900;i++){const a=i/900*Math.PI*2;const noise=Math.sin(a*7+t*.7)*.065+Math.sin(a*13-t*.5)*.035+Math.sin(a*29)*.012+Math.sin(a*71)*.005+Math.sin(a*191+t*2)*.0025+Math.sin(a*317-t)*.0015;const r=radius*(1+noise);points.push([w*.5+Math.cos(a)*r,h*.48+Math.sin(a)*r]);}
  ctx.beginPath();ctx.rect(0,0,w,h);ctx.moveTo(...points[0]);points.forEach(x=>ctx.lineTo(...x));ctx.closePath();ctx.fill('evenodd');
  if(p<.98){ctx.save();ctx.beginPath();ctx.moveTo(...points[0]);points.forEach(x=>ctx.lineTo(...x));ctx.closePath();ctx.strokeStyle=`rgba(255,244,223,${Math.min(1,p*5)})`;ctx.lineWidth=1.3;ctx.shadowColor='#fff2dc';ctx.shadowBlur=16;ctx.stroke();ctx.lineWidth=.4;ctx.shadowBlur=5;ctx.stroke();ctx.restore();
   ctx.save();ctx.fillStyle='#fff3d9';ctx.shadowColor='#fff5df';ctx.shadowBlur=5;
   for(let j=0;j<points.length;j+=2){const [x,y]=points[j],a=j/900*Math.PI*2;const scatter=Math.sin(j*73.17)*7;ctx.globalAlpha=.25+.6*Math.abs(Math.sin(j*13.7+t*3));const size=.3+Math.abs(Math.sin(j*2.37))*.8;ctx.fillRect(x+Math.cos(a)*scatter,y+Math.sin(a)*scatter,size,size);}
   ctx.restore();}
  label.style.opacity=String(1-Math.min(1,t/.65));
  if(p===1){canvas.hidden=true;label.hidden=true;document.body.classList.remove('loading');}
  return reduced?p:Math.max(0,Math.min(1,(t-.7)/2.2));
 }
 return {draw,ready(){if(began!==null)return;began=performance.now();label.querySelector('small').textContent='';document.body.classList.add('entering');},replay(){canvas.hidden=false;label.hidden=false;label.style.opacity='1';document.body.classList.add('loading');document.body.classList.remove('entering');void label.offsetWidth;began=null;this.ready();},fail(){label.querySelector('small').textContent='The scene could not load. Reload to try again.';document.body.classList.add('load-error');}};
}
