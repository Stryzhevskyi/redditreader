/**
 * Created by Sergei on 14.04.15.
 */
define(function (require) {
    var Backbone = require("backbone");
    var constants = require("const");
    var navModel = require("models/NavModel");
    'use strict';

	var App = {
		start: function () {
			console.log('history start');
            App.controller.onStart();
            Backbone.history.start({pushState: true, root: window.location.pathname});
			App.channel.trigger('app:start');
		},
		navigate: function (url, trigger) {
			trigger = (trigger === undefined) ? true : !!trigger;
			App.router.navigate(url, {trigger: trigger});
		},
        navModel : navModel,
        views : {},
		channel: Backbone.channel,
		constants: constants,
		$root: $('#root'),
		$navbar: null,
		$container: null,
		rootUrl: window.location.pathname + '?/'
	};
	window.App = App;
	return App;
});