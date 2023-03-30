// references:
// * https://paweldymek.com/en/post/pwa-minimum-requirements
// * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const CACHE_NAME = 'bill-calendar-0.0.1';
const href = self.location.href;
const BASE_URL = href.slice(0, href.lastIndexOf('/'));
const RESOURCES = [
    '/',
    '/add-bill-dialog.js',
    '/bill-calendar.js',
    '/bill-list-dialog.js',
    '/bills.js',
    '/calendar-day.js',
    '/favicon_512.png',
    '/favicon.ico',
    '/favicon.png',
    '/index.html',
    '/manifest.json',
    '/singleton-element.js',
    '/templated-element.js',
    '/ui-main.js'
].map(r => BASE_URL + r);

self.addEventListener('install', event => {
    const cachePromise = caches
        .open(CACHE_NAME)
        .then(cache => cache.addAll(RESOURCES));
    event.waitUntil(cachePromise);
});

async function activate() {
    const cacheKeys = await caches.keys();
    // We're going to just delete everything that isn't the latest version
    const promises = cacheKeys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k));
    await Promise.all(promises);
}

self.addEventListener('activate', async event => {
    event.waitUntil(activate());
});

async function addToCache(request, response) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
}

async function doFetch(event) {
    const { request } = event;
    try {
        const response = await fetch(request);
        if (response.ok) {
            const clone = response.clone();
            addToCache(request, clone);
        }

        return response;
    } catch (e) { // TypeError, etc.
        return Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

async function cacheOrFetch(event) {
    const { request } = event;
    const cacheResponse = await caches.match(request);
    const fetchPromise = doFetch(event);
    if (cacheResponse) {
        return cacheResponse;
    }
    
    return fetchPromise;
}

self.addEventListener('fetch', event => {
    event.respondWith(cacheOrFetch(event));
});