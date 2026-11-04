import {createProjects} from './projects.js';
export function createWork({reduced,schedule}){
 const details=createProjects(schedule);
 const projects=[['Optimal','optimal'],['Eden','eden'],['PinnacleBox','pinnacle'],['Casa Obrador','casa'],['Techla','techla'],['Coloso','coloso']];
 const root=document.createElement('section');root.id='work';root.inert=true;root.setAttribute('aria-hidden','true');root.setAttribute('aria-labelledby','work-title');
 root.innerHTML=`<div class="work-sky" aria-hidden="true"></div><h2 id="work-title" tabindex="-1">Work</h2><button class="work-back" aria-label="Back to home">← Back</button><div class="work-gallery" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Selected work. Use arrow keys or drag to explore.">${Array.from({length:9},()=>'<button class="work-cover" tabindex="-1"><img alt="" draggable="false"></button>').join('')}</div><div class="work-caption" aria-live="polite"><strong></strong><span></span></div><div class="work-navigation"><button aria-label="Previous project">←</button><span aria-hidden="true">Drag to explore</span><button aria-label="Next project">→</button></div>`;
 document.body.append(root);
 const curtain=document.createElement('div');curtain.className='work-transition-black';curtain.setAttribute('aria-hidden','true');document.body.append(curtain);
 let curtainAnimation=null;
 async function fadeBlack(from,to,duration){curtainAnimation=curtain.animate([{opacity:from},{opacity:to}],{duration,fill:'forwards',easing:'ease-in-out'});try{await curtainAnimation.finished;}catch{}}
 function resetCurtain(){curtainAnimation?.cancel();curtain.classList.remove('visible');document.body.classList.remove('work-departing');}

 const gallery=root.querySelector('.work-gallery'),cards=[...root.querySelectorAll('.work-cover')],caption=root.querySelector('.work-caption');
 let active=false,target=1,position=1,opener=null,drag=null,lastName=-1,request=0;
 const mod=n=>((n%6)+6)%6;
 let preload;
 function load(){return preload??=Promise.all(['firmament-dark',...projects.map(p=>p[1])].map(name=>{const i=new Image();i.src=`assets/work/${name}.png`;return i.decode();}));}
 function draw(){const size=Math.min(innerWidth*.25,innerHeight*.49,520),mobile=innerWidth<700,w=mobile?Math.min(innerWidth*.62,innerHeight*.42):size;gallery.style.setProperty('--cover-size',`${w}px`);const base=Math.floor(position);cards.forEach((card,k)=>{const slot=base+k-4,d=slot-position,a=Math.abs(d),i=mod(slot);if(card.dataset.project!==String(i)){card.dataset.project=i;card.querySelector('img').src=`assets/work/${projects[i][1]}.png`;card.setAttribute('aria-label',projects[i][0]);}card.dataset.slot=slot;card.tabIndex=a<.5?0:-1;const x=d*w*.57,z=-Math.min(a,1)*w*.30-Math.max(0,a-1)*w*.18,angle=-Math.sign(d)*Math.min(a,1)*54;card.style.transform=`translate(-50%,-50%) translate3d(${x}px,0,${z}px) rotateY(${angle}deg)`;card.style.opacity=Math.max(0,Math.min(1,(4.25-a)*2));card.style.filter=`brightness(${Math.max(.35,1-a*.19)})`;card.style.zIndex=100-Math.round(a*10);card.style.pointerEvents=a<3.5?'auto':'none';});const i=mod(Math.round(position));if(i!==lastName){lastName=i;caption.querySelector('strong').textContent=projects[i][0];caption.querySelector('span').textContent='';}}
 async function open(button){
 const token=++request;opener=button;button?.setAttribute('aria-busy','true');
 try{await load();}catch{button?.removeAttribute('aria-busy');return;}
 button?.removeAttribute('aria-busy');if(token!==request)return;
 active=true;document.querySelector('main').inert=true;
 if(!reduced.matches){
 curtain.classList.add('visible');document.body.classList.add('work-departing');
 await fadeBlack(0,1,350);if(token!==request)return;
 }
 root.inert=false;root.setAttribute('aria-hidden','false');document.body.classList.add('work-open');draw();
 if(!reduced.matches){
 await new Promise(resolve=>setTimeout(resolve,180));if(token!==request)return;
 await fadeBlack(1,0,450);if(token!==request)return;
 }
 resetCurtain();root.querySelector('h2').focus({preventScroll:true});
 }
 function close(){if(details.active)details.close();request++;resetCurtain();active=false;drag=null;root.inert=true;root.setAttribute('aria-hidden','true');document.body.classList.remove('work-open');document.querySelector('main').inert=false;opener?.focus();}
 function step(n){target=Math.round(target)+n;}
 root.querySelector('.work-back').onclick=close;
 const nav=root.querySelectorAll('.work-navigation button');nav[0].onclick=()=>step(-1);nav[1].onclick=()=>step(1);
 root.addEventListener('wheel',e=>{if(!active||details.active||document.querySelector('dialog[open]'))return;e.preventDefault();target+=Math.max(-1,Math.min(1,(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*.003));},{passive:false});
 gallery.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,start:target,moved:false};gallery.setPointerCapture(e.pointerId);gallery.classList.add('dragging');});
 gallery.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5)drag.moved=true;target=drag.start-dx/Math.max(120,innerWidth*.2);});
 gallery.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;gallery.classList.remove('dragging');if(moved)target=Math.round(target);else{const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.work-cover');if(hit){target=Number(hit.dataset.slot);details.open(Number(hit.dataset.project),hit);}}});
 gallery.addEventListener('pointercancel',()=>{drag=null;gallery.classList.remove('dragging');target=Math.round(target);});
 window.addEventListener('keydown',e=>{if(!active||details.active||document.querySelector('dialog[open]'))return;if(e.key==='Escape'){close();return;}if(e.key==='Enter'&&(document.activeElement===gallery||document.activeElement?.classList.contains('work-cover'))){e.preventDefault();const card=cards.find(c=>Number(c.dataset.slot)===Math.round(position));details.open(mod(Math.round(position)),card);return;}if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();step(['ArrowRight','ArrowDown'].includes(e.key)?1:-1);}});
 document.querySelector('.brand').addEventListener('click',e=>{if(active){e.preventDefault();close();}});
 return {open,close,get active(){return active;},update(dt){if(!active||details.active)return;position=reduced.matches?target:position+(target-position)*(1-Math.exp(-dt*14));if(Math.abs(target-position)<.001)position=target;draw();},replay(){if(!active)return false;target=1;return true;}};
}
