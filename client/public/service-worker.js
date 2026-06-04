const CACHE_NAME = "anonchat-shell-v16-sidebar-cleanup";
const SHELL_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/css/styles.css?v=sidebar-cleanup-20260605",
  "/css/landing-nav-fix.css?v=sidebar-cleanup-20260605",
  "/css/auth-page-fix.css?v=sidebar-cleanup-20260605",
  "/css/user-chat-room-fix.css?v=sidebar-cleanup-20260605",
  "/js/app.js?v=sidebar-cleanup-20260605",
  "/assets/logo/logo.png",
  "/assets/anonchat-preview.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/socket.io/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/offline.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      const copy = response.clone();
      if (response.ok && url.origin === self.location.origin) {
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => new URL(client.url).origin === self.location.origin);
      if (existing) {
        existing.focus();
        existing.postMessage({ type: "anonchat:notification-click", url: targetUrl, roomId: event.notification.data?.roomId || "" });
        return;
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
