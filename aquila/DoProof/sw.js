const CACHE = "dough-app-v12";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./app/index.html",
        "./app/app.js",
        "./app/js/main.js",
        "./app/js/ui.js",
        "./app/js/data.js",
        "./app/js/calculator.js",
        "./app/js/storage.js",
        "./app/js/theme.js",
        "./app/css/base.css",
        "./app/css/layout.css",
        "./app/css/components.css",
        "./app/src/DoProof_logo logo - transparent.png",
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() =>
        caches.match(`./app/index.html`)
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});