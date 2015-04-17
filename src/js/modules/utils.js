/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "underscore", "const"], function (Backbone, _, constants) {
    var MINUTE = 60;
    var HOUR = 60*MINUTE;
    var DAY = HOUR*24;
    var MONTH = DAY*30;
    var YEAR = DAY*365;

    return new function () {
        var self = this;

        self.getQueryFromCurrentUrl = function () {
            return Backbone.history.location.search.split('/').slice(1);
            //return window.location.href
            //    .split('?')
            //    .slice(1)
            //    .join()
            //    .split('/')
            //    .slice(1);
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
            if ((Date.now() - date) / YEAR*1000 > 10)
                date *= 1000;
            date = (new Date(date));
            var res = date.toLocaleDateString();
            if (withTime){
                res += ' - ' + ('00' + date.getHours()).slice(-2);
                res += ':' + ('00' + date.getMinutes()).slice(-2);
                res += ':' + ('00' + date.getSeconds()).slice(-2);
            }
            return res;
        };

        self.timeDiff = function(date){
            if ((Date.now() - date) / (365 * 24 * 60 * 60 * 1000) > 10)
                date *= 1000;
            var diff = (Date.now() - date) / 1000;
            if(diff < MINUTE){
                return 'just now';
            }
            if(diff < HOUR){
                return Math.round(diff/MINUTE) + ' minutes ago';
            }
            if(diff < DAY){
                return Math.round(diff/HOUR) + ' hours ago';
            }
            if(diff < MONTH){
                return Math.round(diff/DAY) + ' days ago';
            }
            if(diff < YEAR){
                return Math.round(diff/MONTH) + ' months ago';
            }
            return 'a long time ago'
        }

    };
});
