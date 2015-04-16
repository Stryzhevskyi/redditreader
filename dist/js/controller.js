/**
 * Created by Sergei on 16.04.15.
 */
define(function (require) {
    var App = require("app");
    var _ = require("underscore");
    var $ = require("jquery");
    var Backbone = require("backbone");
    var utils = require("utils");

    var Controller = function () {
        var self = this;

        self.onStart = function(){
            console.log('onStart');
            App.$navbar.html(App.tpls['NavBar']({
                items : utils.getNavbarList()
            }));
            App.$navbar.on('click', '.fake-link.navlink', function(ev){
                var section = ev.currentTarget.dataset.section;

                App.navigate();
            });
        };

        self.onRoot = function () {
            console.log('onRoot');
            self.onRedditMain();
            // App.navigate()
        };

        self.onRedditPage = function (id, section, page) {
            console.log('onRedditPage', id, section, page);
        };
    };

    //App.controller = new Controller();
    return Controller;
});
