/**
 * Created by Sergei on 14.04.15.
 */

define(["app", "backbone", "tpls", "underscore", "utils"],
    function (App, Backbone, tpls, _, utils) {
        tpls._ = _;
        tpls.$utils = utils;
        _.templateSettings = {
            evaluate: /\{\{(.+?)\}\}/g,
            interpolate: /\{\{=(.+?)\}\}/g,
            escape: /\{\{-(.+?)\}\}/g,
            variable: 'o'
        };

        App.tpls = tpls;
        App.utils = utils;


        require(["router"], function (App) {
            App.start();
            App.channel.trigger('app:start');
        });
    });