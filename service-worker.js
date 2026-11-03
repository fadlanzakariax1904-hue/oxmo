const CACHE = 'oxmo-v2';

self.addEventListener('install', () => { self.skipWaiting(); });

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return res; })
      .catch(() => caches.match(event.request))
  );
});
