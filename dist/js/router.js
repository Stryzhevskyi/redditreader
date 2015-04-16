/**
 * Created by Sergei on 14.04.15.
 */
define(function(require) {
  var App = require("app");
  var Backbone = require("backbone");
  var Controller = require("controller");

  App.controller = new Controller();

  var Router = Backbone.Router.extend({
    constructor: function() {
      App.controller.onStart();
    },
    routes: {
      "?/:id/:section/:page": "redditSectionPage",
      "?/:id/:section": "redditSection",
      "?/:id": "redditMain",
      "?/": "root",
      "": "empty"
    },

    empty: function() {
      console.log('empty');
      App.navigate('?/');
    },

    root: function() {
      console.log('root');
      App.controller.onRoot();
    },

    redditMain: function(id) {
      console.log('redditMain', id);
      App.controller.onRedditPage(id, App.contants.SECTIONS[0], 0);
    },

    redditSection: function(id, section) {
      console.log('redditPage', id, section);
      App.controller.onRedditPage(id, section, 0);
    },

    redditSectionPage: function(id, section, page) {
      console.log('redditPage', id, page);
      App.controller.onRedditPage(id, page, page);
    }

  });


  App.router = new Router();
  return App;
});
