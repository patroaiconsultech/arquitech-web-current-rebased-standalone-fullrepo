const GLIP_CACHE = "glip-shell-v1";
const GLIP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icons/glip-192.png",
  "/icons/glip-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(GLIP_CACHE)
      .then((cache) => cache.addAll(GLIP_SHELL))
      .catch(() => undefined)
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
            .filter((key) => key.startsWith("glip-shell-") && key !== GLIP_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function shouldBypass(request, url) {
  if (request.method !== "GET") return true;
  if (url.origin !== self.location.origin) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname === "/env.js") return true;
  return false;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (shouldBypass(request, url)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(GLIP_CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        if (request.mode === "navigate") {
          return (await caches.match("/")) || Response.error();
        }

        return Response.error();
      }),
  );
});
