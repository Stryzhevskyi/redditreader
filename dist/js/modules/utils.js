/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "underscore", "const"], function (Backbone, _, constants) {
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
        }

    };
});
