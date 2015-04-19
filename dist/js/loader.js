/**
 * Created by Sergei on 14.04.15.
 */

define(["backbone", "tpls", "underscore", "utils"],
	function (Backbone, tpls, _, utils) {
        'use strict';

        window.DEBUG = true;

        var channel = _.extend({}, Backbone.Events);
        if(DEBUG){
            channel.on('all', function () {
                console.info.apply(
                    console,
                    ['channel : '].concat(Array.prototype.slice.call(arguments))
                );
            });
        }
        Backbone.channel = channel;

        require(["app"], function(App){
            utils.extendTpls(tpls, App);

            App.tpls = tpls;
            App.utils = utils;

            require(["router"], function (Router) {
                App.router = Router();
                App.start();
            });
        });
	});