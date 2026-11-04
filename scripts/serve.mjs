import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('site');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.glb':'model/gltf-binary','.ttf':'font/ttf','.otf':'font/otf'};
createServer(async(req,res)=>{try{
 let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}
 if((await stat(path)).isDirectory())path=resolve(path,'index.html');
 const data=await readFile(path),headers={'Content-Type':types[extname(path)]||'application/octet-stream','Accept-Ranges':'bytes'};
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${data.length}`}).end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(data.subarray(start,end+1));}
 else{res.writeHead(200,{...headers,'Content-Length':data.length});res.end(data);}
 }catch{res.writeHead(404).end('Not found');}
}).listen(4176,'127.0.0.1',()=>console.log('Portfolio: http://localhost:4176'));
