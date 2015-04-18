/**
 * Created by Sergei on 14.04.15.
 */

define(["app", "backbone", "tpls", "underscore", "utils"],
	function (App, Backbone, tpls, _, utils) {
		tpls._ = _;
		tpls.$utils = utils;
		_.templateSettings = {
			evaluate: /\{\{(.+?)\}\}/g,
			interpolate: /\{\{=(.+?)\}\}/g,
			escape: /\{\{-(.+?)\}\}/g,
			variable: 'o'
		};
		tpls.$app = App;
		tpls.$href = function (link) {
			return App.rootUrl + link;
		};
        tpls.$fragment = Backbone.history.fragment;

		App.tpls = tpls;
		App.utils = utils;


		require(["router"], function (Router) {
			App.router = Router();
			App.start();
		});
	});