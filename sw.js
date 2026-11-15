const SHELL="pv-shell-v2",TILES="pv-tiles-v1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["./","./index.html"]).catch(()=>{})));});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim());});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  if(u.hostname==="tile.openstreetmap.org"){
    e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;
      const r=await fetch(e.request);if(r&&(r.ok||r.type==="opaque")){c.put(e.request,r.clone());
        c.keys().then(k=>{if(k.length>2500)k.slice(0,300).forEach(x=>c.delete(x));});}return r;}));return;}
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(SHELL).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));}
});
