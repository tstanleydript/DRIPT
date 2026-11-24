// Dript app service worker (V29): only shows sale alerts pushed by the agent. It doesn't cache anything,
// so the app always loads the latest index.html from GitHub Pages.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let m = {};
  try { m = e.data ? e.data.json() : {}; } catch (err) { m = { title: e.data ? e.data.text() : 'Dript' }; }
  e.waitUntil(self.registration.showNotification(m.title || 'Dript', {
    body: m.body || '',
    tag: m.tag || undefined,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: { url: m.url || './' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
