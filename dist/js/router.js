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
			"?/:id/t/:topic": "topic",
			"?/:id/s/:section/a/:after": "sectionPage",
			"?/:id/s/:section": "section",
			"?/:id": "main",
			"?/": "root",
			"?/s/:section": "rootSection",
			"": "empty",
			".*": "empty"
		},

		empty: function () {
			console.log('empty');
			App.navigate('/?/');
		},

		root: function () {
			console.log('root');
            App.navModel.setState(null, App.constants.SECTIONS[0], null, null, null);
            controller.onRedditPage(null, App.constants.SECTIONS[0], null);
		},

		rootSection: function (section) {
			console.log('root');
            App.navModel.setState(null, section, null, null, null);
            controller.onRedditPage(null, section, null);
		},

		main: function (id) {
			console.log('redditMain', id);
            App.navModel.setState(id, App.constants.SECTIONS[0], null, null, null);
            controller.onRedditPage(id, App.constants.SECTIONS[0], null);
		},

		topic: function (id, topic) {
			console.log('topic', id, topic);
            App.navModel.setState(id, null, null, topic);
            controller.onRedditTopic(id, topic, null);
		},


		section: function (id, section) {
			console.log('section', id, section);
            App.navModel.setState(id, section, null, null);
			controller.onRedditPage(id, section, null);
		},

		sectionPage: function (id, section, after) {
			console.log('sectionPage', id, after);
            App.navModel.setState(id, section, after, null);
			controller.onRedditPage(id, after, after);
		}

	});


	return function(params){
		return router ? router : router = new Router(params);
	};
});
