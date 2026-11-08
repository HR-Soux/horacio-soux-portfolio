// Keep artwork proportions intact and release observers whenever a project closes.
export function mountStudy(article){
 const abort=new AbortController(),{signal}=abort;
 const resize=()=>{
  article.querySelectorAll('.art-fit').forEach(box=>{const canvas=box.firstElementChild;const scale=box.clientWidth/(Number(box.dataset.artWidth)||1920);canvas.style.transform=`scale(${scale})`;box.style.height=`${parseFloat(canvas.style.height)*scale}px`;});
  article.querySelectorAll('.casa-slide').forEach(box=>{box.firstElementChild.style.transform=`scale(${box.clientHeight/692.965})`;});
 };
 const observer=new ResizeObserver(resize);observer.observe(article);resize();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animations=new Set(),frames=new Set();
 const textTargets=[...article.querySelectorAll('h2,h3,h4,p,.project-footer,.study-footer,.optimal-tagline,.project-year,.art-fit,.casa-slide,.pinnacle-preview,.eden-wordmark,.optimal-wordmark,.techla-logo,.pinnacle-hero>div>img')].filter(el=>!el.closest('.art-canvas,.casa-art')&&!el.parentElement.closest('p'));
 const reveal=reduced?null:new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;reveal.unobserve(e.target);const a=e.target.animate([{opacity:0},{opacity:1}],{duration:650,easing:'ease-out'});animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));}},{root:article.closest('.project-modal'),threshold:.08});
 textTargets.forEach(el=>reveal?.observe(el));
 const counters=reduced?null:new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;counters.unobserve(e.target);const el=e.target,end=Number(el.dataset.count),start=performance.now();const tick=now=>{const progress=Math.min(1,(now-start)/1100);el.textContent='+'+Math.round(end*(1-Math.pow(1-progress,3)));if(progress<1){const id=requestAnimationFrame(t=>{frames.delete(id);tick(t);});frames.add(id);}};tick(start);}},{root:article.closest('.project-modal'),threshold:.65});
 article.querySelectorAll('[data-count]').forEach(el=>counters?.observe(el));
 for(const hero of article.querySelectorAll('.eden-hero,.optimal-hero,.techla-hero')){
  if(reduced)continue;
  hero.classList.add('project-parallax');
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=hero.getBoundingClientRect();hero.style.setProperty('--hero-x',`${((e.clientX-r.left)/r.width-.5)*24}px`);hero.style.setProperty('--hero-y',`${((e.clientY-r.top)/r.height-.5)*16}px`);},{signal});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-x','0px');hero.style.setProperty('--hero-y','0px');},{signal});
 }
 const gallery=article.querySelector('.casa-gallery');
 if(gallery){let start=null;
  gallery.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;start={x:e.clientX,left:gallery.scrollLeft};gallery.setPointerCapture(e.pointerId);gallery.classList.add('dragging');},{signal});
  gallery.addEventListener('pointermove',e=>{if(start)gallery.scrollLeft=start.left-(e.clientX-start.x);},{signal});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])gallery.addEventListener(event,()=>{start=null;gallery.classList.remove('dragging');},{signal});
  gallery.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();gallery.scrollBy({left:gallery.clientWidth*.65*(e.key==='ArrowRight'?1:-1),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}},{signal});
 }
 const coloso=article.querySelector('.coloso-case');
 if(coloso&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  coloso.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=coloso.getBoundingClientRect();coloso.style.setProperty('--coloso-x',`${((e.clientX-r.left)/r.width-.5)*44}px`);coloso.style.setProperty('--coloso-y',`${((e.clientY-r.top)/r.height-.5)*30}px`);},{signal});
  coloso.addEventListener('pointerleave',()=>{coloso.style.setProperty('--coloso-x','0px');coloso.style.setProperty('--coloso-y','0px');},{signal});
 }
 return ()=>{abort.abort();observer.disconnect();reveal?.disconnect();counters?.disconnect();frames.forEach(cancelAnimationFrame);animations.forEach(a=>a.cancel());};
}
