/**
 * Created by Sergei on 16.04.15.
 */
define(function (require) {
	var App = require("app");
	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");
	var utils = require("utils");

	var controller = null;
	var Controller = function () {
		console.log('Controller created');
		App.channel.on('app:start', this.onStart);
	};
	Controller.prototype = {
		constructor: Controller,

		onStart: function () {
			console.log('onStart');
			App.$root.html(App.tpls['Root']({
				items: utils.getNavbarList()
			}));

			App.$navbar = $('#navbar');
			App.$container = $('#container');

			App.$navbar.html(App.tpls['NavBar']({
				items: utils.getNavbarList()
			}));

			App.$root.on('click', '.fake-link', function (ev) {
				ev.preventDefault();
				var link = ev.currentTarget.getAttribute('href');
				App.navigate(link);
			});
		},

		onRoot: function () {
			console.log('onRoot');
			self.onRedditMain();
			// App.navigate()
		},

		onRedditPage: function (id, section, page) {
			console.log('onRedditPage', id, section, page);
		},

		onRedditTopic : function(id, topic){

		}
	};

	return function(params){
		return controller ? controller : controller = new Controller(params);
	};
});
