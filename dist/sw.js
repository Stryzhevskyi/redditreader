// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
var CACHE_VERSION = 2;
var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION,
    dynamic: 'dynamic-cache-v' + CACHE_VERSION
};
var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
});

var errors = [];

self.addEventListener('install', function (event) {
    var urlsToPrefetch = [
        './min/build.js',
        './min/build.css',
        '.img/icon-lg.png',
        '.img/icon-md.png',
        '.img/icon-sm.png',
        '.img/icon-xs.png',
        '.img/splash.png',
        '.favicon.ico'
    ];

    console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

    event.waitUntil(
        caches.open(CURRENT_CACHES['prefetch']).then(function (cache) {
            return cache.addAll(urlsToPrefetch.map(function (urlToPrefetch) {
                // It's very important to use {mode: 'no-cors'} if there is any chance that
                // the resources being fetched are served off of a server that doesn't support
                // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
                // In this example, www.chromium.org doesn't support CORS, and the fetch()
                // would fail if the default mode of 'cors' was used for the fetch() request.
                // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
                // cross-origin hosts will always be opaque
                // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
                // and it is not possible to determine whether an opaque response represents a success or failure
                // (https://github.com/whatwg/fetch/issues/14).
                return new Request(urlToPrefetch, {mode: 'no-cors'});
            })).then(function () {
                console.log('All resources have been fetched and cached.');
            });
        }).catch(function (error) {
            errors.push(error);
            // This catch() will handle any exceptions from the caches.open()/cache.addAll() steps.
            console.error('Pre-fetching failed:', error);
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('Handling fetch event for', event.request.url);

    event.respondWith(
        // caches.match() will look for a cache entry in all of the caches available to the service worker.
        // It's an alternative to first opening a specific named cache and then matching on that.
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Found response in cache:', response);

                return response;
            }

            console.log('No response found in cache. About to fetch from network...');

            // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
            // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
            return fetch(event.request).then(function (response) {
                console.log('Response from network is:', response);

                return response;
            }).catch(function (error) {
                errors.push(error);
                // This catch() will handle exceptions thrown from the fetch() operation.
                // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                // It will return a normal response object that has the appropriate error code set.
                console.error('Fetching failed:', error);

                throw error;
            });
        })
    );
});


self.addEventListener('message', function (event) {
    console.log('Handling message event:', event);
    var name = event.data.fn;
    if (typeof self[fn] === 'function') {
        self[fn].call(this, event);
    }
    //
    //caches.open(CURRENT_CACHES['post-message']).then(function (cache) {
    //    switch (event.data.command) {
    //        // This command returns a list of the URLs corresponding to the Request objects
    //        // that serve as keys for the current cache.
    //        case 'keys':
    //
    //            break;
    //
    //        // This command adds a new request/response pair to the cache.
    //        case 'add':
    //            // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
    //            // by the outer .catch().
    //            // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
    //            // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
    //            var request = new Request(event.data.url, {mode: 'no-cors'});
    //            cache.add(request).then(function () {
    //                event.ports[0].postMessage({
    //                    error: null
    //                });
    //            });
    //            break;
    //
    //        // This command removes a request/response pair from the cache (assuming it exists).
    //        case 'delete':
    //            var request = new Request(event.data.url, {mode: 'no-cors'});
    //            cache.delete(request).then(function (success) {
    //                event.ports[0].postMessage({
    //                    error: success ? null : 'Item was not found in the cache.'
    //                });
    //            });
    //            break;
    //
    //        default:
    //            // This will be handled by the outer .catch().
    //            throw 'Unknown command: ' + event.data.command;
    //    }
    //}).catch(function (error) {
    //    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    //    console.error('Message handling failed:', error);
    //
    //    event.ports[0].postMessage({
    //        error: error.toString()
    //    });
    //});
});

/**
 * @this {Event}
 * @returns {*}
 */
self.getStatus = function (event) {
    var self = this;
    return Promise.all(expectedCacheNames.map(function (name) {
        return caches.open(name);
    })).then(function () {
        var caches = Array.prototype.slice.call(arguments);
        Promise.all(caches.map(function (cache) {
            console.log('cache', cache);
            return cache.keys().then(function (requests) {
                var urls = requests.map(function (request) {
                    return request.url;
                });
            });
        })).then(function () {
            // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
            // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
            // handler from the controlled page.
            // It's up to you how to structure the messages that you send back; this is just one example.
            this.ports[0].postMessage({
                errors: errors,
                urls: Array.prototype.slice.call(arguments),
                cacheNames: CURRENT_CACHES
            });
        })
    }).catch(function (error) {
        console.error('getStatus failed :', error);
        event.ports[0].postMessage({
            error: error.toString()
        });
    });
}