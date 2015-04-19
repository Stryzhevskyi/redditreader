/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "underscore", "const"], function (Backbone, _, constants) {
    'use strict';

    var MINUTE = 60;
    var HOUR = 60 * MINUTE;
    var DAY = HOUR * 24;
    var MONTH = DAY * 30;
    var YEAR = DAY * 365;
    var regexReddit = /\/r\//g

    var App;

    function decodeHtml(encoded, o) {
        if (o && o.body && o.body.slice(0, 3) === '/r/') {
            encoded = encoded.replace(regexReddit, App.rootUrl);
        }
        var div = document.createElement('div');
        div.innerHTML = encoded;
        var decoded = div.firstChild.nodeValue;
        div = null;
        if (encoded.indexOf('CatsAreAssholes') > -1) console.error(o);
        return decoded;
    }

    return new function () {
        var self = this;

        self.getQueryFromCurrentUrl = function () {
            return Backbone.history.location.search.split('/').slice(1);
        };

        self.extendTpls = function (tpls, app) {
            App = app;
            tpls._ = _;
            tpls.$utils = self;
            _.templateSettings = {
                evaluate: /\{\{(.+?)\}\}/g,
                interpolate: /\{\{=(.+?)\}\}/g,
                escape: /\{\{-(.+?)\}\}/g,
                variable: 'o'
            };
            tpls.$app = App;
            tpls.$href = function (link) {
                return App.rootUrl + link;
            };
            tpls.$fragment = Backbone.history.fragment;
            tpls.$decode = decodeHtml;

            tpls.$permalink = function (hash) {
                return App.navModel.getPermalink(hash)
            };
            self.decodeHtml = decodeHtml;
        };


        self.registerServiceWorker = function () {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js', {
                    //scope : '/dist/'
                }).then(function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }).catch(function (err) {
                    console.error('ServiceWorker registration failed: ', err);
                });
            } else {
                alert('ServiceWorket is not supported, close your old browser!');
            }
        };

        self.capitalizeFirst = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        self.getNavbarList = function () {
            return _.map(constants.SECTIONS, function (section) {
                return {
                    section: section,
                    name: self.capitalizeFirst(section)
                }
            });
        };

        self.currentFragment = function () {
            var Router = App.router,
                fragment = Backbone.history.fragment,
                routes = _.pairs(Router.routes),
                route = null,
                params = null,
                matched;

            matched = _.find(routes, function (handler) {
                route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
                return route.test(fragment);
            });

            if (matched) {
                params = Router._extractParameters(route, fragment);
                route = matched[1];
            }

            return {
                route: route,
                fragment: fragment,
                params: params
            };
        };

        self.readableDate = function (date, withTime) {
            if (withTime === undefined) withTime = true;
            if ((Date.now() - date) / YEAR * 1000 > 10)
                date *= 1000;
            date = (new Date(date));
            var res = date.toLocaleDateString();
            if (withTime) {
                res += ' - ' + ('00' + date.getHours()).slice(-2);
                res += ':' + ('00' + date.getMinutes()).slice(-2);
                res += ':' + ('00' + date.getSeconds()).slice(-2);
            }
            return res;
        };

        self.timeDiff = function (date) {
            if ((Date.now() - date) / (365 * 24 * 60 * 60 * 1000) > 10)
                date *= 1000;
            var diff = (Date.now() - date) / 1000;
            if (diff < MINUTE) {
                return 'just now';
            }
            if (diff < HOUR) {
                return Math.round(diff / MINUTE) + ' minutes ago';
            }
            if (diff < DAY) {
                return Math.round(diff / HOUR) + ' hours ago';
            }
            if (diff < MONTH) {
                return Math.round(diff / DAY) + ' days ago';
            }
            if (diff < YEAR) {
                return Math.round(diff / MONTH) + ' months ago';
            }
            return 'a long time ago'
        };

        self._nextTickStack = [];
        self._tickTimeout = null;
        self.nextTick = function (func) {
            var self = this;
            this._nextTickStack.push(func);
            if (this._tickTimeout) clearTimeout(this._tickTimeout);
            setTimeout(function () {
                self._nextTickStack.forEach(function (ex) {
                    ex();
                });
            }, 0);
        };

    };
});
