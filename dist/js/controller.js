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
    var commentsModel = require("models/Comments");

    var PostListView = require("views/PostListView");
    var CommentTreeView = require("views/CommentTreeView");

    'use strict';

    var controller = null;
    var Controller = function () {
        console.log('Controller created');

        App.postsCollection = postsCollection;
        App.commentsModel = commentsModel;
        //App.channel.on('app:start', this.onStart);
    };
    Controller.prototype = {
        constructor: Controller,

        onStart: function () {
            console.log('onStart');
            App.$root.html(App.tpls['Root']({}));

            App.$navbar = $('#navbar');
            App.$container = $('#container');
            App.$progressIndicator = $('#progress-indicator');


            App.navModel.on('change', function () {
                App.$navbar.html(App.tpls['NavBar']({
                    items: App.navModel.getNavBarObject()
                }));
            });
            postsCollection.on('sync', function () {
                App.navModel.set({
                    after: postsCollection.after
                })
            });

            App.navModel.trigger('change');

            App.views.postListView = new PostListView({collection: postsCollection, App : App});
            App.views.commentTreeView = new CommentTreeView({model: commentsModel, App : App});

            App.$root.on('click', '.fake-link', function (ev) {
                ev.preventDefault();
                var link = ev.currentTarget.getAttribute('href');
                App.navigate(link);
            });

            App.router.on('route', function(route, params){
                console.info('ROUTE',route, params);
            });

            //$.ajaxSetup({
            //    global : true
            //});
            //
            //$(document).ajaxStart(function () {
            //    App.$progressIndicator.show();
            //});
            //$(document).ajaxStop(function () {
            //    App.$progressIndicator.hide();
            //});

            $.material.init();
        },

        onRedditPage: function (id, section, after) {
            console.log('onRedditPage', arguments);
            App.postsCollection
                .fetch(App.navModel.toJSON())
                .then(function (coll) {

                });
        },

        onRedditTopic: function (id, topic, comment) {
            console.log('onRedditTopic', arguments);
            App.views.commentTreeView.scrollToComment = comment;
            App.commentsModel
                .fetch({section:id, id:topic, limit:200})
                .then(function (coll) {
                    console.log(coll);
                });
        }
    };

    return function (params) {
        return controller ? controller : controller = new Controller(params);
    };
});
