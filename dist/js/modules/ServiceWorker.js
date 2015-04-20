/**
 * Created by Sergei on 19.04.15.
 */
define(["messages"], function (msg) {
    var modluleInstance;
    var defaultParams = {
        worker: {
            file: 'sw.js',
            settings: {
                scope: './'
            }
        }
    };
    var ServiceWorkerModule = function ServiceWorkerModule(params) {
        this.init(params);
    };

    ServiceWorkerModule.prototype = {
        constructor: ServiceWorkerModule,
        init: function (params) {
            params = params || defaultParams;
            if (!('serviceWorker' in navigator)) {
                var error = 'ServiceWorker is not available in current web browser, use another one.';
                msg.error(error);
                throw  new Error(error);
            }
            return this.
                _registerWorker(params.worker)
                .then(function () {
                    if (!navigator.serviceWorker.controller) {
                        msg.info('If you want use cache, reload page, please.', 8000);
                    }
                });
        },
        status: {
            isRegistered: false,
            cacheName: null,
            urls: 0,
            errors: []
        },
        _registerWorker: function (worker) {
            var self = this;
            return navigator.serviceWorker
                .register(worker.file, worker.settings)
                .then(function (registration) {
                    self.status.isRegistered = true;
                    console.info('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function (err) {
                    self.status.errors.push(err);
                    console.error('ServiceWorker registration failed: ', err);
                });
        },
        channel: {
            trigger: function (msg) {
                console.info(msg)
            }
        },
        sendMessage: function (msg) {
            // This wraps the message posting/response in a promise, which will resolve if the response doesn't
            // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
            // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
            // a convenient wrapper.
            return new Promise(function (resolve, reject) {
                if (!navigator.serviceWorker.controller) {
                    return reject(new Error('ServiceWorker just started, messages don\'t work. Reload page, please.'));
                }
                var messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = function (event) {
                    if (event.data.error) {
                        reject(event.data.error);
                    } else {
                        resolve(event.data);
                    }
                };

                // This sends the message data as well as transferring messageChannel.port2 to the service worker.
                // The service worker can then use the transferred port to reply via postMessage(), which
                // will in turn trigger the onmessage handler on messageChannel.port1.
                // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
                navigator.serviceWorker.controller.postMessage(msg, [messageChannel.port2]);
            });
        },
        getStatus: function () {
            return this.sendMessage({
                fn: 'getStatus'
            });
        },
        cacheUrls : function(urls){
            return this.sendMessage({
                fn: 'cacheUrls',
                args: [urls]
            });
        },
        cacheUrl : function(url){
            return this.cacheUrls([url]);
        },
        deleteUrl : function(url){
            return this.deleteUrls([url]);
        },
        deleteUrls : function(urls){
            return this.sendMessage({
                fn : 'deleteUrls',
                args: [urls]
            })
        },
        deleteCache : function(cacheName){
            cacheName = cacheName || 'dynamic';
            return this.sendMessage({
                fn : 'deleteCache',
                args: [cacheName]
            })
        }
    };

    return function (params) {
        if (!modluleInstance) {
            modluleInstance = new ServiceWorkerModule(params);
        }
        return modluleInstance;
    }
});