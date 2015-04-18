/**
 * Created by Sergei on 14.04.15.
 */

define(["app", "backbone", "tpls", "underscore", "utils"],
	function (App, Backbone, tpls, _, utils) {
        'use strict';

        utils.extendTpls(tpls, App);

		App.tpls = tpls;
		App.utils = utils;


		require(["router"], function (Router) {
			App.router = Router();
			App.start();
		});
	});