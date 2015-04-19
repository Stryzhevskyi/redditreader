/**
 * Created by Sergei on 17.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls", "models/NavModel"], function (Backbone, _, $, tpls, navModel) {
    'use strict';

    var App;

    var PostListView = Backbone.View.extend({
        initialize: function (options) {
            App = options.App;
            _.bindAll(this, 'render', 'renderNav');
            this.template = tpls['PostList'];
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(navModel, 'change', this.renderNav);
        },

        el: '#content',

        events: {
            'click .btn-back': 'historyBack'
        },

        historyBack: function () {
            window.history.back();
        },

        render: function () {
            console.log(this);
            this.$el.html(this.template({
                items: this.collection.toJSON()
            }));

            this.renderNav();

            return this;
        },

        renderNav: function () {
            this.$el.find('.page-nav').html(tpls['PageNav']({
                nav: {
                    after: navModel.getLinkPostsAfter()
                },
                after: navModel.get('after'),
                back: window.history.length > 1 //TODO: so ugly...
            }));
        }
    });
    return PostListView;
});