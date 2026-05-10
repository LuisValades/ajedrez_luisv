/* ReinoChess — service worker for offline-capable PWA. */
const VERSION = "v1";
const STATIC_CACHE = `reino-static-${VERSION}`;
const RUNTIME_CACHE = `reino-runtime-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/icon.svg",
  "/stockfish/stockfish.js",
  "/stockfish/stockfish.wasm",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            fetch(url, { cache: "reload" })
              .then((res) => (res.ok ? cache.put(url, res) : null))
              .catch(() => null),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Stockfish files: cache-first (heavy WASM, doesn't change).
  if (url.pathname.startsWith("/stockfish/")) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // Static assets: cache-first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE));
    return;
  }

  // Pages: network-first with cache fallback.
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }
});

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    const fallback = await caches.match("/");
    if (fallback) return fallback;
    return new Response("Offline", { status: 503 });
  }
}
