/**
 * Created by Sergei on 14.04.15.
 */
define(function (require) {
	var App = require("app");
	var Backbone = require("backbone");
	var Controller = require("controller");

	var controller = App.controller = Controller();

	var router = null;
	var Router = Backbone.Router.extend({
		initialize: function (options) {

		},

		routes: {
			"?/:id/s/:section/t/:topic": "topic",
			"?/:id/s/:section/p/:page": "sectionPage",
			"?/:id/s/:section": "section",
			"?/:id": "main",
			"?/": "empty",
			"": "empty",
			"*": "empty"
		},

		empty: function () {
			console.log('empty');
			App.navigate('?/*/s/hot');
		},

		main: function (id) {
			console.log('redditMain', id);
			controller.onRedditPage(id, App.contants.SECTIONS[0], 0);
		},

		topic: function (id, topic) {
			console.log('topic', id, topic);
			controller.onRedditTopic(id, topic, 0);
		},


		section: function (id, section) {
			console.log('section', id, section);
			controller.onRedditPage(id, section, 0);
		},

		sectionPage: function (id, section, page) {
			console.log('sectionPage', id, page);
			controller.onRedditPage(id, page, page);
		}

	});


	return function(params){
		return router ? router : router = new Router(params);
	};
});
