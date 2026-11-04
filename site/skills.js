export function createSkills(root,reduced){
 const items=[['After Effects','Ae','ae'],['Adobe XD','xd'],['InDesign','indesign'],['Photoshop','Ps','ps'],['Illustrator','Ai','ai'],['Figma','figma'],['Claude','claude'],['ChatGPT','chatgpt'],['Magnific','magnific'],['Mailchimp','mailchimp'],['Notion','notion'],['Linear','linear'],['Miro','miro']];
 const panel=document.createElement('section');panel.className='skills-panel';panel.setAttribute('aria-labelledby','skills-title');
 panel.innerHTML=`<h2 id="skills-title">Skills</h2><div class="skills-dock-band"><div class="skills-dock" role="group" aria-label="Design and collaboration tools">${items.map(([name,asset,type])=>`<button class="skill-item" aria-label="${name}" type="button"><span class="skill-visual"><span class="skill-art ${type||asset}">${type?`<span>${asset}</span>`:`<img src="assets/skills/${asset}.svg" alt="">`}</span></span><span class="skill-tooltip" aria-hidden="true">${name}</span></button>`).join('')}</div></div><p class="skills-copy">Combines creative direction, art direction, design, multimedia, and product thinking to build cohesive brand experiences. Connecting identity, audience, and purpose.</p><div class="skills-cta"><p>Would you like to know more about my experience?</p><button class="glass-button" id="skills-contact">Let’s talk</button></div>`;
 root.append(panel);
 const dock=panel.querySelector('.skills-dock'),buttons=[...dock.querySelectorAll('button')];
 function reset(){buttons.forEach(b=>{b.style.removeProperty('--lift');b.style.removeProperty('--grow');b.style.removeProperty('--push');});}
 function magnify(x,y){
  if(reduced.matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  if(getComputedStyle(dock).display==='grid'){
   buttons.forEach(b=>{const r=b.getBoundingClientRect(),near=x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;b.style.setProperty('--grow',near?1.25:1);b.style.setProperty('--lift',near?'-12px':'0px');b.style.setProperty('--push','0px');});return;
  }
  const rect=dock.getBoundingClientRect(),step=rect.width/buttons.length,radius=step*2.3;
  const icon=buttons[0].querySelector('.skill-visual').offsetWidth;
  const waves=buttons.map((b,i)=>{const influence=Math.max(0,1-Math.abs(rect.left+step*(i+.5)-x)/radius);return (1-Math.cos(influence*Math.PI))/2;});
  const expansions=waves.map(w=>icon*w*.55),total=expansions.reduce((a,b)=>a+b,0);let offset=-total/2;
  buttons.forEach((b,i)=>{b.style.setProperty('--grow',1+waves[i]*.55);b.style.setProperty('--lift',`${-waves[i]*24}px`);b.style.setProperty('--push',`${offset+expansions[i]/2}px`);offset+=expansions[i];});
 }

 dock.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')magnify(e.clientX,e.clientY)});dock.addEventListener('pointerleave',reset);
 buttons.forEach(b=>{b.addEventListener('focus',()=>{const r=b.getBoundingClientRect();magnify(r.left+r.width/2,r.top+r.height/2)});b.addEventListener('blur',reset)});
 root.addEventListener('keydown',e=>{if(e.target.closest('button,input,textarea,dialog'))return;if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)){e.preventDefault();const down=['ArrowDown','PageDown','End',' '].includes(e.key);root.scrollTo({top:down?root.scrollHeight:0,behavior:reduced.matches?'instant':'smooth'});}});
 return {reset(){root.scrollTop=0;reset();}};
}
