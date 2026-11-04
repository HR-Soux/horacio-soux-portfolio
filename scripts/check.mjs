import {readdir,readFile,stat,access} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
const {assetPath}=await import('../site/asset-paths.js');
const root=resolve('site');let count=0,total=0;
async function walk(dir){for(const name of await readdir(dir)){const p=join(dir,name),s=await stat(p);if(s.isDirectory()){await walk(p);continue;}count++;total+=s.size;if(s.size>100*1024*1024)throw Error(`File too large: ${p}`);if(extname(p)==='.js')execFileSync(process.execPath,['--check',p]);}}
await walk(root);
for(const p of ['index.html','app.js','sections.css','assets/falcon-optimized.glb','assets/sun-optimized.glb','assets/projects/techla-web.mp4','assets/projects/eden-portal.mp4'])await access(join(root,p));
for(const name of await readdir(root)){if(!/\.(js|css|html)$/.test(name))continue;const text=await readFile(join(root,name),'utf8');for(const m of text.matchAll(/(?:\.\/)?assets\/[A-Za-z0-9_./-]+\.(?:png|webp|jpg|svg|mp4|ttf|otf|glb)/g))await access(join(root,assetPath(m[0])));}
console.log(`Checked ${count} files; ${(total/1048576).toFixed(1)} MiB. JavaScript and explicit asset paths OK.`);
