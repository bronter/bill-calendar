// reference: https://paweldymek.com/en/post/pwa-minimum-requirements

const CACHE_NAME = 'bill-calendar-0.0.0';
const URLS_TO_CACHE = [
    '/index.html',
    '/index.css',
    '/calendar-day.js',
    '/calendar.js'
];

self.addEventListener('install', function(event) {
    // const cachePromise = caches.open(CACHE_NAME);
    // cachePromise.then(cache => cache.addAll(URLS_TO_CACHE));
    // event.waitUntil(cachePromise);
});

self.addEventListener('activate', event => {
    // const cachePromise = caches
    //     .keys()
    //     .then(keylist => Promise.all(keyList.map(key => {
    //         if (key !== CACHE_NAME) {// TODO includes?
    //             return caches.delete(key);
    //         }
    //     })));
    // event.waitUntil(cachePromise);
})

self.addEventListener('fetch', event => {
    const request = event.request;
    console.log(request.url, self.location.origin);
    if (request.url.startsWith(self.location.origin)) {
        // const cachePromise = caches.match(request)
        //     .then(cache => {
        //         if (cache) {
        //             return cache;
        //         }
    
        //         return caches.open(CACHE_NAME).then(cache => {
        //             if (!navigator.onLine) {
        //                 return;
        //             }

        //             return fetch(event.request);
        //         });
        //     });
        // event.respondWith(cachePromise);
        event.respondWith(fetch(event.request));
    }
});