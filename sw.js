const MAIN_CACHE = 'zenbox-v13';

self.addEventListener("install", async (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(MAIN_CACHE)
        await cache.addAll([
            './',
            './index.html',
            './icon.svg',
            './icon-192.png',
            './icon-512.png',
            './apple-touch-icon.png',
            './manifest.json'
        ])
    })())
});

const deleteCache = async (key) => {
    await caches.delete(key);
};

const deleteOldCaches = async () => {
    const cacheKeepList = [MAIN_CACHE];
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        await deleteOldCaches();
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith(async function () {
        const cachedResponse = await caches.match(e.request.url)
        if (cachedResponse) {
            // cache hit
            return cachedResponse
        } else {
            // fallback to fetch
            return fetch(e.request)
        }
    }())
})