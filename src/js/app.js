/**
 * Created by Sergei on 14.04.15.
 */
define(function (require) {
    var Backbone = require("backbone");
    var constants = require("const");
    var navModel = require("models/NavModel");



	var channel = _.extend({}, Backbone.Events);
	channel.on('all', function () {
		console.info.apply(
			console,
			['channel : '].concat(Array.prototype.slice.call(arguments))
		);
	});
    Backbone.channel = channel;

	var App = {
		start: function () {
			console.log('history start');
			Backbone.history.start({pushState: true, root: window.location.pathname});
			App.channel.trigger('app:start');
		},
		navigate: function (url, trigger) {
			trigger = (trigger === undefined) ? true : !!trigger;
			App.router.navigate(url, {trigger: trigger});
		},
        navModel : navModel,
        views : {},
		channel: channel,
		constants: constants,
		$root: $('#root'),
		$navbar: null,
		$container: null,
		rootUrl: window.location.pathname + '?/'
	};
	window.App = App;
	return App;
});