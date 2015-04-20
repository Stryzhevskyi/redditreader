/**
 * Created by Sergei on 14.04.15.
 */
define(function (require) {
    var App = require("app");
    var Backbone = require("backbone");
    var Controller = require("controller");

    'use strict';

    var controller = App.controller = Controller();

    var router = null;
    var Router = Backbone.Router.extend({
        initialize: function (options) {
            var self = this;
            this.listenTo(App.navModel, 'change:search', function () {
                self.navigate(App.navModel._getUrl());
            })
        },

        routes: {
            "?/:id/t/:topic": "topic",
            "?/:id/t/:topic/c/:comment": "topicComment",
            "?/s/:section": "rootSection",
            "?/s/:section/a/:after": "rootSection",
            "?/s/:section/q/:query": "sectionSearch",
            "?/s/:section/q/:query/a/:after": "sectionSearch",
            "?/:id/s/:section": "section",
            "?/:id/s/:section/a/:after": "sectionAfter",
            "?/:id": "main",
            "?/:id/": "main",
            "?/": "root",
            "": "empty"
        },

        empty: function () {
            console.log('empty');
            App.navigate('/?/');
        },

        root: function () {
            App.navModel.set(App.navModel.defaults());
            controller.onRedditPage(null, App.constants.SECTIONS[0], null);
        },

        rootSection: function (section, after) {
            App.navModel.setState(null, section, null, after);
            controller.onRedditPage(null, section, after);
        },

        sectionSearch: function (section, query, after) {
            App.navModel.setState(null, section, null, after);
            App.navModel.set({search: query});
            controller.onSearch(section, query, after);
        },


        main: function (id) {
            App.navModel.setState(id, App.constants.SECTIONS[0], null, null, null);
            controller.onRedditPage(id, App.constants.SECTIONS[0], null);
        },


        section: function (id, section) {
            App.navModel.setState(id, section, null, null);
            controller.onRedditPage(id, section, null);
        },

        sectionAfter: function (id, section, after) {
            App.navModel.setState(id, section, null, after);
            controller.onRedditPage(id, section, after);
        },

        topic: function (id, topic) {
            console.log('topic', id, topic);
            App.navModel.setState(id, null, topic, null);
            controller.onRedditTopic(id, topic);
        },

        topicComment: function (id, topic, comment) {
            console.log('topic', id, topic);
            App.navModel.setState(id, null, topic, null);
            App.navModel.set({comment: comment});
            controller.onRedditTopic(id, topic, comment);
        }

    });


    return function (params) {
        return router ? router : router = new Router(params);
    };
});
