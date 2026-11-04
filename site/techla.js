import {assetPath} from './asset-paths.js';
const asset=(group,name,ext='png')=>assetPath(`assets/projects/techla-${group}-${name}.${ext}`);
const img=(group,name,alt='',ext='png',cls='')=>`<img class="${cls}" src="${asset(group,name,ext)}" alt="${alt}" loading="lazy">`;
export function techla(footer){return `<div class="techla-case">
 <div class="techla-hero">
 ${img('1234-3861','imgVector','','svg','techla-grid')}
 ${img('1234-3861','imgChatGptImageNov12026115927Am1','Techla shortcut keyboard held in hand','png','techla-hand')}
 ${img('1234-3861','imgVector1','Techla','svg','techla-logo')}
 </div>
 <section class="techla-highlights techla-content">
 <div class="techla-outline" role="img" aria-label="Techla keyboard concept drawing">
 ${img('1234-3872','imgRectangle176','','svg','techla-shell')}
 ${img('1234-3872','imgFrame3','','svg','techla-dial')}
 ${img('1234-3872','imgVector1','','svg','techla-outline-logo')}
 <div class="techla-keys">${Array.from({length:10},(_,i)=>`<span>${i===0?img('1234-3872','imgVector','','svg'):''}</span>`).join('')}</div></div>
 <div><h3>Highlights</h3><p>A private project in which I was involved in hardware design and conceptualization, as well as all aspects related to graphic design and product design.</p></div></section>
 <section class="techla-about techla-content"><h3>About the project</h3><p>The goal was to create various portable, long-lasting shortcut keyboards. With a 90s-inspired design approach, we developed different models and variations to categorize and address the specific needs of each user.</p>
 <div class="techla-products">${img('1242-4630','imgChatGptImageOct312026103426Pm1','Techla keyboard variations')}${img('1242-4630','imgChatGptImageOct312026103426Pm2','','png','techla-products-overlay')}</div></section>
 <section class="techla-web techla-content"><video controls playsinline preload="metadata" poster="assets/projects/techla-web-poster.jpg" aria-label="Techla website demonstration"><source src="assets/projects/techla-web.mp4" type="video/mp4"></video><div><h3>Web</h3><p>I also had the opportunity to design part of the website and its interactions, incorporating simple movements and animations, while focusing on a high-end finish.</p></div></section>
 <section class="techla-views techla-content"><h3>Some Product Views</h3><div class="techla-view-strip" tabindex="0" aria-label="Techla product design views, scroll horizontally">${['6869','7024','7273'].map((id,i)=>`<img src="assets/projects/techla-1261-${id}.svg" alt="Techla product configuration design ${i+1}" loading="lazy">`).join('')}</div></section>
 <section class="techla-outro"><p>With this concept, I plan to open a new branch within my profession and become more involved in the conceptualization of physical products.</p><div>${img('1234-3866','imgImage28','Techla keyboard side view')}${img('1234-3866','imgImage29','','png','techla-side-overlay')}</div></section>
 ${footer}</div>`;}
