// Keep artwork proportions intact and release observers whenever a project closes.
export function mountStudy(article){
 const abort=new AbortController(),{signal}=abort;
 const resize=()=>{
  article.querySelectorAll('.art-fit').forEach(box=>{const canvas=box.firstElementChild;const scale=box.clientWidth/1920;canvas.style.transform=`scale(${scale})`;box.style.height=`${parseFloat(canvas.style.height)*scale}px`;});
  article.querySelectorAll('.casa-slide').forEach(box=>{box.firstElementChild.style.transform=`scale(${box.clientHeight/692.965})`;});
 };
 const observer=new ResizeObserver(resize);observer.observe(article);resize();
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
 return ()=>{abort.abort();observer.disconnect();};
}
