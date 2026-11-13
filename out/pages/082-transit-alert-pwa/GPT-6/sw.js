const CACHE=`path-alert-demo:${self.registration.scope}:v1`;
const FILES=["index.html","style.css","app.js","assets/engine.js","assets/inter.woff2","assets/icons.svg","assets/favicon.svg","assets/map.svg","assets/icon-192.png","assets/icon-512.png","manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(file=>new URL(file,self.registration.scope).href));await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;const url=new URL(event.request.url),scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin||!url.href.startsWith(scope.href))return;
  const relative=url.pathname.slice(scope.pathname.length);
  if(relative!==""&&!FILES.includes(relative))return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE),key=new URL(relative||"index.html",scope).href;return await cache.match(key)||fetch(event.request);})());
});
