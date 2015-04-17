/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "const"], function (Backbone, constants) {

	var channel = _.extend({}, Backbone.Events);
	channel.on('all', function () {
		console.info.apply(
			console,
			['channel : '].concat(Array.prototype.slice.call(arguments))
		);
	});

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