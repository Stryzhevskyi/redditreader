/**
 * Created by Sergei on 16.04.15.
 */
define(function (require) {
	var App = require("app");
	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");
	var utils = require("utils");
    var postsCollection = require("collections/Posts");

    var PostListView = require("views/PostListView");

	var controller = null;
	var Controller = function () {
		console.log('Controller created');

        App.postsCollection = postsCollection;
		App.channel.on('app:start', this.onStart);
	};
	Controller.prototype = {
		constructor: Controller,

		onStart: function () {
			console.log('onStart');
			App.$root.html(App.tpls['Root']({   }));

			App.$navbar = $('#navbar');
			App.$container = $('#container');


            App.navModel.on('change', function(){
                App.$navbar.html(App.tpls['NavBar']({
                    items: App.navModel.getNavBarObject()
                }));
            });
            postsCollection.on('sync', function(){
               App.navModel.set({
                   after : postsCollection.after,
                   before : postsCollection.before,
               })
            });

            App.navModel.trigger('change');

            App.views.postListView = new PostListView({collection : postsCollection});

			App.$root.on('click', '.fake-link', function (ev) {
				ev.preventDefault();
				var link = ev.currentTarget.getAttribute('href');
				App.navigate(link);
			});

            $.material.init();
		},

		onRedditPage: function (id, section, page) {
			console.log('onRedditPage', id, section, page);
            App.postsCollection
                .fetch(App.navModel.toJSON())
                .then(function(coll){

                });
		},

		onRedditTopic : function(id, topic){

		}
	};

	return function(params){
		return controller ? controller : controller = new Controller(params);
	};
});
