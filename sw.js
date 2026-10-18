const V='fs-v8.7';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png',
'fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2','fonts/ibm-plex-sans-arabic-arabic-500-normal.woff2','fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2',
'fonts/ibm-plex-sans-arabic-latin-400-normal.woff2','fonts/ibm-plex-sans-arabic-latin-500-normal.woff2','fonts/ibm-plex-sans-arabic-latin-600-normal.woff2',
'fonts/readex-pro-arabic-500-normal.woff2','fonts/readex-pro-arabic-700-normal.woff2','fonts/readex-pro-latin-500-normal.woff2','fonts/readex-pro-latin-700-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const isPage=r.mode==='navigate'||r.url.endsWith('index.html');
  if(isPage){ // network first: new versions arrive as soon as there's internet
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));
  } else {
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res})));
  }
});
