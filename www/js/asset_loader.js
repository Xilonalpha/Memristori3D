/* MEMRISTORI 3D ASSET LIBRARY
 * Local-first for installed builds, remote fallback for the external library.
 */
(function(){
'use strict';
const CACHE='memristor-3d-assets-v2';
let manifest=null;
const DEFAULT_BASE='https://xilonalpha.github.io/MemristoriGame/assets/3d/';
async function getManifest(){
  if(manifest) return manifest;
  try{ const r=await fetch('assets/3d/manifest.json',{cache:'no-store'}); if(r.ok) manifest=await r.json(); }
  catch(e){ console.warn('Memristor asset manifest unavailable',e); }
  if(!manifest) manifest={version:2,baseUrl:DEFAULT_BASE,assets:{},files:[]};
  return manifest;
}
function join(base,path){return String(base||'').replace(/\/$/,'')+'/'+String(path||'').replace(/^\//,'');}
async function getArrayBuffer(keyOrUrl){
  const m=await getManifest(); let remote=null,local=null;
  if(/^https?:\/\//i.test(keyOrUrl)){remote=keyOrUrl;}
  else {
    const a=(m.assets||{})[keyOrUrl];
    if(a){local=a.local||null;remote=a.url?join(m.baseUrl,a.url):a.remote?join(m.baseUrl,a.remote):null;}
    if(!local) local='models/'+keyOrUrl+'.glb';
  }
  const cache=await caches.open(CACHE).catch(()=>null);
  const tryFetch=async(url,cacheIt)=>{
    if(!url)return null;
    if(cache){const hit=await cache.match(url);if(hit)return hit.arrayBuffer();}
    const r=await fetch(url,{cache:'no-store',mode:url.startsWith(location.origin)?'same-origin':'cors'});
    if(!r.ok)throw Error('GLB HTTP '+r.status);
    const bytes=await r.arrayBuffer();
    if(cache&&cacheIt)cache.put(url,new Response(bytes.slice(0),{headers:{'Content-Type':'model/gltf-binary'}})).catch(()=>{});
    return bytes;
  };
  try{return await tryFetch(local,true);}catch(localErr){
    if(remote){try{return await tryFetch(remote,true);}catch(remoteErr){throw remoteErr;}}
    throw localErr;
  }
}
window.MemristorAssetLoader={getArrayBuffer,getManifest,cacheName:CACHE};
})();
