const CACHE_NAME = "dough-app-v12";

const assetsToCache = [
  "./index.html",
  "./app.js",
  "./js/main.js",
  "./js/ui.js",
  "./js/data.js",
  "./js/calculator.js",
  "./js/storage.js",
  "./js/theme.js",
  "./css/base.css",
  "./css/layout.css",
  "./css/components.css",
  "./src/DoProof_logo logo - transparent.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
