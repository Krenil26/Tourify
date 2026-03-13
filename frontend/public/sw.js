// Tourifyy Offline Survival Mode — Service Worker
// Caches critical app pages and assets for offline use

const CACHE_NAME = "tourifyy-offline-v1"
const OFFLINE_PAGE = "/offline-survival"

const APP_SHELL = [
    "/",
    "/offline-survival",
    "/planner",
    "/destinations",
    "/nature-guard",
    "/global-sanctuary",
    "/tribal-sync",
    "/wildlife-insight",
]

// Install: pre-cache the app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_SHELL).catch((err) => {
                console.warn("[SW] Pre-cache partial failure:", err)
            })
        }).then(() => self.skipWaiting())
    )
})

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    )
})

// Fetch: network-first for API calls, cache-first for static assets
self.addEventListener("fetch", (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET and chrome-extension requests
    if (request.method !== "GET" || url.protocol === "chrome-extension:") return

    // API calls: network first, no cache fallback (data must be fresh)
    if (url.hostname.includes("onrender.com") || url.pathname.startsWith("/api/")) {
        event.respondWith(
            fetch(request).catch(() =>
                new Response(JSON.stringify({ error: "Offline — data unavailable" }), {
                    headers: { "Content-Type": "application/json" },
                    status: 503,
                })
            )
        )
        return
    }

    // App navigation: stale-while-revalidate
    if (request.mode === "navigate") {
        event.respondWith(
            caches.match(request).then((cached) => {
                const networkFetch = fetch(request).then((response) => {
                    if (response.ok) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
                    }
                    return response
                }).catch(() => cached || caches.match(OFFLINE_PAGE))
                return cached || networkFetch
            })
        )
        return
    }

    // Static assets: cache first
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached
            return fetch(request).then((response) => {
                if (response.ok) {
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()))
                }
                return response
            }).catch(() => null)
        })
    )
})
