// ============================================
// SERVICE WORKER - Coloretto PWA
// ============================================
// Per aggiornare: incrementa VERSION e ridistribuisci.
// Il nuovo SW si attiverà automaticamente.

const VERSION = 'v1';
const CACHE_NAME = `coloretto-${VERSION}`;

// Asset da pre-cachare all'installazione
const PRECACHE_ASSETS = [
    '/',
    '/coloretto/',
    '/memory/',
    '/puzzle/',
    '/forme/',
    '/vesti/',
    '/conta/',
    '/favicon.svg',
    '/manifest.webmanifest',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// ============================================
// INSTALL: pre-cache tutti gli asset
// ============================================
self.addEventListener('install', (event) => {
    console.log(`[SW] Installing ${VERSION}`);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-caching assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => {
                // Attiva immediatamente senza attendere
                return self.skipWaiting();
            })
    );
});

// ============================================
// ACTIVATE: pulisce le cache vecchie
// ============================================
self.addEventListener('activate', (event) => {
    console.log(`[SW] Activating ${VERSION}`);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('coloretto-') && name !== CACHE_NAME)
                        .map((name) => {
                            console.log(`[SW] Deleting old cache: ${name}`);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                // Prende controllo di tutte le pagine aperte
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH: strategia cache-first con fallback network
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Ignora richieste non-GET
    if (request.method !== 'GET') return;

    // Ignora richieste esterne
    if (!request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Asset in cache, ritorna immediatamente
                    return cachedResponse;
                }

                // Non in cache, fetch dalla rete e aggiungi alla cache
                return fetch(request)
                    .then((networkResponse) => {
                        // Clona la risposta perché può essere letta solo una volta
                        const responseToCache = networkResponse.clone();

                        // Aggiungi alla cache in background
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline e non in cache - ritorna pagina home come fallback
                        if (request.mode === 'navigate') {
                            return caches.match('/');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// ============================================
// MESSAGE: gestisce messaggi dal client
// ============================================
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
