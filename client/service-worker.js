const CACHE_NAME = "anonchat-shell-v31-dp-tap-input-fix";
const SHELL_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/css/styles.css?v=dp-tap-input-fix-20260623",
  "/css/landing-nav-fix.css?v=layout-qa-20260622b",
  "/css/auth-page-fix.css?v=home-cleanup-20260605",
  "/css/user-chat-room-fix.css?v=layout-qa-20260622b",
  "/js/app.js?v=dp-tap-input-fix-20260623",
  "/assets/logo/logo.png",
  "/assets/anonchat-preview.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset))))
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
  let url;

  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isApiRequest = url.pathname.startsWith("/api/") || url.pathname.startsWith("/socket.io/");
  const isMediaRequest = ["audio", "video"].includes(request.destination);
  const isVersionedCodeRequest =
    url.pathname.startsWith("/js/") ||
    url.pathname.startsWith("/css/") ||
    url.pathname === "/service-worker.js";
  const isCacheableRequest = request.method === "GET" && sameOrigin && !isApiRequest && !isMediaRequest;

  if (!isCacheableRequest) {
    return;
  }

  if (isVersionedCodeRequest) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (response.ok && response.type !== "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match("/offline.html").then((offline) =>
            offline ||
            new Response("AnonChat is offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response.ok && response.type !== "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() =>
          caches.match("/offline.html").then((offline) =>
            offline ||
            new Response("", {
              status: 504,
              statusText: "Offline",
            })
          )
        );
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  self.navigator?.clearAppBadge?.().catch(() => {});
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) =>
        new URL(client.url).origin === self.location.origin && client.visibilityState === "visible"
      ) || clients.find((client) => new URL(client.url).origin === self.location.origin);
      if (existing) {
        const message = {
          type: "anonchat:notification-click",
          url: targetUrl,
          roomId: event.notification.data?.roomId || "",
          dmThreadId: event.notification.data?.dmThreadId || "",
        };
        existing.postMessage(message);
        if (typeof existing.navigate === "function") {
          return existing.navigate(targetUrl)
            .then((navigated) => {
              navigated?.postMessage(message);
              return navigated?.focus();
            })
            .catch(() => existing.focus());
        }
        return existing.focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      clients.forEach((client) => client.postMessage({ type: "anonchat:push-subscription-change" }));
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json?.() || {};
  } catch {
    payload = { title: "AnonChat", body: event.data?.text?.() || "New update" };
  }

  const title = payload.title || "AnonChat";
  const options = {
    body: payload.body || "You have a new message.",
    icon: "/assets/logo/logo.png",
    badge: "/assets/logo/logo.png",
    tag: payload.tag || "anonchat-update",
    renotify: true,
    silent: false,
    timestamp: Date.now(),
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Open chat" },
      { action: "dismiss", title: "Dismiss" },
    ],
    data: {
      url: payload.url || "/chat",
      roomId: payload.roomId || "",
      dmThreadId: payload.dmThreadId || "",
    },
  };

  const badgeTask = self.navigator?.setAppBadge
    ? self.navigator.setAppBadge(Math.max(1, Number(payload.badgeCount || 1))).catch(() => {})
    : Promise.resolve();
  const notificationTask = self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const visibleClient = clients.some((client) => client.visibilityState === "visible");
    if (visibleClient) return;
    return self.registration.showNotification(title, options);
  });

  event.waitUntil(Promise.all([badgeTask, notificationTask]));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "anonchat:skip-waiting") {
    self.skipWaiting();
  }
});
