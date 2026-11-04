import {createWork} from './work.js';
import {createSkills} from './skills.js';
// Section content stays separate from the animated hero and its loading lifecycle.
export function createSections({showInfo, schedule, reduced}) {
 const work=createWork({reduced,schedule});
 const root=document.createElement('section'); root.id='experience';root.inert=true;root.setAttribute('aria-hidden','true');root.setAttribute('aria-labelledby','experience-title');
 const points=[[280,566,'Chromart','2016'],[450,483,'Freelance','2017'],[620,427,'Caravan Agency','2018–2019'],[790,395,'Lat Media','2020–2022'],[960,385,'Freelance','2023'],[1130,395,'Eden','2023–2025'],[1300,427,'Optimal','2026']];
 root.innerHTML=`<div class="experience-stage"><div class="night-landscape"></div><div class="night-shade"></div><img class="night-grid" src="assets/experience/grid.svg" alt=""><h2 id="experience-title" tabindex="-1">Experience</h2><div class="timeline-parallax"><div class="timeline-reveal" aria-hidden="true"><img class="timeline-arc" src="assets/experience/arc.svg?v=we-are-here" alt=""></div><ol class="timeline" aria-label="Experience timeline">${points.map(([x,y,name,dates],i)=>`<li style="--x:${x}px;--y:${y}px;--delay:${650+i*180}ms" class="${i>3?'above':''}"><img src="assets/experience/dot.svg" alt=""><div class="milestone-label" tabindex="0" aria-label="${name}, ${dates}"><span>${name}</span><span class="milestone-date">${dates}</span></div></li>`).join('')}<li class="timeline-now" style="--x:1470px;--y:483px;--delay:1910ms"><img src="assets/experience/current.svg" alt=""><span class="glass-button">We are here</span></li></ol></div><div class="experience-cta"><p>Over 10 years of collaborating with various<br class="desktop-break"> companies, projects, and proposals.</p></div><button class="experience-next" id="experience-next" aria-label="Explore Skills"><img src="assets/experience/down-arrow.svg" alt=""></button></div><button class="experience-back" aria-label="Back to home">← Back</button></section>`;
 const backdrop=document.createElement('div');backdrop.className='experience-backdrop';backdrop.setAttribute('aria-hidden','true');
 root.querySelectorAll('.night-landscape,.night-shade,.night-grid').forEach(layer=>backdrop.append(layer));root.prepend(backdrop);
 document.body.append(root);
 const skills=createSkills(root,reduced);
 const status=document.createElement('p');status.className='section-status';status.setAttribute('role','status');document.body.append(status);
 const night=new Image();night.src='assets/experience/night.lossless.webp';const ready=night.decode();ready.catch(()=>{});
 let active=false,request=0,opener=null;
 const hoverPointer=matchMedia('(hover: hover) and (pointer: fine)');
 let px=0,py=0;
 function update(x,y,dt,paused){
  work.update(dt);
  if(paused&&!reduced.matches)return;
  const enabled=active&&hoverPointer.matches&&!reduced.matches&&!document.querySelector('dialog[open]');
  const easing=1-Math.exp(-dt*4);px+=((enabled?x:0)-px)*easing;py+=((enabled?y:0)-py)*easing;
  root.style.setProperty('--parallax-x',`${px*20}px`);root.style.setProperty('--parallax-y',`${py*12}px`);
  root.style.setProperty('--copy-x',`${px*10}px`);root.style.setProperty('--copy-y',`${py*6}px`);
 }
 function resize(){root.style.setProperty('--timeline-scale',innerWidth/1920);}resize();window.addEventListener('resize',resize);
 function close(){skills.reset();request++;active=false;document.body.classList.remove('experience-open');root.classList.remove('revealed');root.inert=true;root.setAttribute('aria-hidden','true');document.querySelector('main').inert=false;status.textContent='';opener?.focus();}
 async function open(button){const token=++request;opener=button;status.textContent='Preparing Experience…';try{await ready;}catch{status.textContent='Could not load Experience. Please try reloading the page.';return;}if(token!==request)return;active=true;skills.reset();status.textContent='';document.body.classList.add('experience-open');document.querySelector('main').inert=true;root.inert=false;root.setAttribute('aria-hidden','false');root.classList.add('revealed');root.querySelector('h2').focus({preventScroll:true});}
 document.querySelector('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-section]');if(!b)return;const index=Number(b.dataset.section);if(index===0){showInfo('Background', '');const p=document.querySelector('#dialog-copy');p.insertAdjacentHTML('afterend','<div class="background-details"><section><h3>Profile</h3><p>He combines creative direction, art direction, design, multimedia, and product thinking to build cohesive brand experiences. Connecting identity, audience, and purpose.</p></section><section><h3>Path</h3><p>His background spans branding, campaigns, multimedia, and advanced digital product design, allowing to balance strong aesthetics with strategy, usability, and clarity.</p></section><dl><div><dt>Location</dt><dd>Bolivia</dd></div><div><dt>Focus</dt><dd>Brand & communication</dd></div><div><dt>More</dt></div></dl></div>');}else if(index===1)open(b);else if(index===2)work.open(b);else showInfo(['Background','Experience','Work','Projects','Merch','Mag'][index],'Coming soon.');});
 root.querySelector('.experience-back').onclick=close;root.querySelector('#experience-next').onclick=()=>{const panel=root.querySelector('.skills-panel');root.scrollTo({top:panel.offsetTop,behavior:reduced.matches?'instant':'smooth'});};
 root.querySelector('#skills-contact').onclick=()=>schedule.showModal();
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active&&!document.querySelector('dialog[open]'))close();});
 document.querySelector('.brand').addEventListener('click',e=>{if(active){e.preventDefault();close();}});
 return {update,get active(){return active||work.active;},replay(){if(work.replay())return true;if(!active)return false;skills.reset();root.classList.remove('revealed');void root.offsetWidth;root.classList.add('revealed');return true;}};
}
