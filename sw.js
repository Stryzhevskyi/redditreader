// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.

(function () {
    if (!Cache.prototype.add) {
        Cache.prototype.add = function add(request) {
            return this.addAll([request]);
        };
    }

    if (!Cache.prototype.addAll) {
        Cache.prototype.addAll = function addAll(requests) {
            var cache = this;

            // Since DOMExceptions are not constructable:
            function NetworkError(message) {
                this.name = 'NetworkError';
                this.code = 19;
                this.message = message;
            }

            NetworkError.prototype = Object.create(Error.prototype);

            return Promise.resolve().then(function () {
                if (arguments.length < 1) throw new TypeError();

                // Simulate sequence<(Request or USVString)> binding:
                var sequence = [];

                requests = requests.map(function (request) {
                    if (request instanceof Request) {
                        return request;
                    }
                    else {
                        return String(request); // may throw TypeError
                    }
                });

                return Promise.all(
                    requests.map(function (request) {
                        if (typeof request === 'string') {
                            request = new Request(request);
                        }

                        var scheme = new URL(request.url).protocol;

                        if (scheme !== 'http:' && scheme !== 'https:') {
                            throw new NetworkError("Invalid scheme");
                        }

                        return fetch(request.clone());
                    })
                );
            }).then(function (responses) {
                // TODO: check that requests don't overwrite one another
                // (don't think this is possible to polyfill due to opaque responses)
                return Promise.all(
                    responses.map(function (response, i) {
                        return cache.put(requests[i], response);
                    })
                );
            }).then(function () {
                return undefined;
            });
        };
    }
})();


'use strict';

var FILE_NAME = 'sw.js';
var ROOT_PATH = location.pathname.replace(FILE_NAME, '');
var CACHE_VERSION = 1;
var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION,
    dynamic: 'dynamic-cache-v' + CACHE_VERSION
};
var REDDIT_CACHABLE_URL = /https?\:\/\/www\.reddit\.com\/r\/.+\.json/;

var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    return CURRENT_CACHES[key];
});

var errors = [];

/**
 * Iterate caches
 *
 * @param {Function} callback
 * @param {Object} [ctx]
 * @param {Array} [args]
 * @returns {Promise}
 */
function iterateCaches(callback, ctx, args) {
    args = args || [];
    ctx = ctx || self;
    return caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
                return caches.open(cacheName).then(function (cache) {
                    var _args = [cache].concat(args);
                    return callback.apply(ctx, _args);
                })
            })
        )
    });
}

self.addEventListener('install', function (event) {
    var urlsToPrefetch = [
        'min/build.js',
        'min/build.css',
        'img/icon-lg.png',
        'img/icon-md.png',
        'img/icon-sm.png',
        'img/icon-xs.png',
        'img/splash.png',
        'favicon.ico'
    ];

    console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch, event);

    event.waitUntil(self._cacheUrls('prefetch', urlsToPrefetch));
});

/**
 * Add cached response to specific cache
 * @param {String} cacheName
 * @param {Array} urls
 * @returns {*}
 * @private
 */
self._cacheUrls = function (cacheName, urls) {
    return caches.open(CURRENT_CACHES[cacheName]).then(function (cache) {
        console.log(cache);
        return cache.addAll(urls.map(function (urlToPrefetch) {
            return new Request(urlToPrefetch);
        })).then(function () {
            console.log('All resources have been fetched and cached.');
            return {status: 'ok'};
        });
    }).catch(function (error) {
        errors.push(error.stack);
        console.error('Pre-fetching failed:', error);
        return {error: error.stack};
    })
};

/**
 *
 * @param {String}cacheName
 * @param {Request} request
 * @param {Response} response
 * @returns {Promise}
 * @private
 */
self._cacheRequestResponse = function(cacheName, request, response){
    return caches.open(CURRENT_CACHES[cacheName]).then(function(cache){
        return cache.put(request, response);
    });
};

self.addEventListener('activate', function (event) {
    console.info('Activate', event);
    event.waitUntil(
        iterateCaches(function (cacheName) {
            if (expectedCacheNames.indexOf(cacheName) == -1) {
                console.log('Deleting out of date cache:', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.info('Fetch', event.request.url, event);
    var clonerRequest = event.request.clone();
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Found response in cache:', response);
                return response;
            }
            console.log('No response found in cache. About to fetch from network...');
            return fetch(event.request).then(function (response) {
                console.log('Response from network is:', response);
                if(response.url.match(REDDIT_CACHABLE_URL) && response.status < 400){
                    self._cacheRequestResponse('dynamic', clonerRequest, response.clone());
                }
                return response;
            }).catch(function (error) {
                errors.push(error.stack);
                console.error('Fetching failed:', error);
            });
        })
    );
});


self.addEventListener('message', function (event) {
    var fn = event.data.fn,
        args = event.data.args || [];
    console.info('Msg:', fn, args);
    args.unshift(event);
    if (typeof self[fn] === 'function') {
        return self[fn].apply(self, args).then(function (res) {
            event.ports[0].postMessage(res);
        });
    }
});


self.getStatus = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        Promise.all(expectedCacheNames.map(function (name) {
            return caches.open(name);
        })).then(function (caches) {
            Promise.all(caches.map(function (cache) {
                console.log('cache', cache);
                return cache.keys().then(function (requests) {
                    var urls = requests.map(function (request) {
                        return request.url;
                    });
                    return urls;
                });
            })).then(function (urls) {
                console.log(urls, errors, CURRENT_CACHES);
                resolve({
                    errors: errors,
                    urls: urls,
                    cacheNames: CURRENT_CACHES
                });
            })
        }).catch(function (error) {
            console.error('getStatus failed :', error);
            errors.push(error.stack);
            reject({
                error: error.toString()
            });
        });
    });
};

self.cacheUrls = function (event, urls) {
    var self = this;
    console.log(event, urls);
    return self._cacheUrls('dynamic', urls);
};

self.deleteUrls = function (event, urls) {
    return iterateCaches(function (cacheName) {
        var tasks = urls.map(function (url) {
            var request = new Request(url);
            return cacheName.delete(request).then(function (success) {
                return {
                    status: (success ? null : 'Item was not found in the cache.'),
                    url: url
                };
            });
        });
        return Promise.all(tasks);
    });
};

self.deleteCache = function(cacheName){
    return caches.delete(CURRENT_CACHES[cacheName]);
};