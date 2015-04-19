/**
 * Created by Sergei on 17.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls", "const", "utils"], function (Backbone, _, $, tpls, constants, utils) {
    'use strict';

    var App;
    var CommentTreeView = Backbone.View.extend({
        initialize: function (options) {
            App = options.App;
            _.bindAll(this, 'render', 'renderPost', 'scrollTo', 'updateSubtree');
            this.template = tpls['CommentList'];
            this.listenTo(this.model, 'sync', this.render);
            this.listenTo(this.model, 'node:modify', this.updateSubtree);
        },

        el: '#content',

        events: {
            'click .load-mode-comments': 'loadMoreComments',
            'click .collapse-tree': 'toggleTree',
            'click .change-order': 'changeOrder'
        },

        scrollToComment: null,

        post: {},

        render: function () {
            var data = {
                items: this.model.tree,
                commentOrder: this.model.get('commentOrder')
            };
            data.orders = _.without(this.model.get('orders'), data.commentOrder);
            this.$el.html(this.template(data));

            this.renderPost();

            utils.nextTick(this.scrollTo);

            return this;
        },

        scrollTo: function (hash) {
            hash = hash || this.scrollToComment;
            if (!hash) return;
            $('body').animate({
                scrollTop: this.$el.find('#comment-' + hash).offset().top - App.$navbar.outerHeight()
            }, 1000);
        },

        renderPost: function () {
            this.$el.find('#post-wrapper').html(tpls['Post'](this.model.post));
        },

        updateSubtree: function (node) {
            console.info('update', node);
            var subtreeHtml = '';
            node.replies.forEach(function (leaf) {
                subtreeHtml += tpls['Comment'](leaf);
            });
            this.$el
                .find('#comment-' + node.id)
                .find('.replies')
                .html(subtreeHtml);
        },

        loadMoreComments: function (ev) {
            var id = ev.currentTarget.dataset.id;
            if (id) {
                this.model
                    .morechildren(id)
                    .then(function (res) {
                        console.log(res);
                    });
            }
        },

        changeOrder: function (ev) {
            var order = ev.currentTarget.dataset.order;
            this.model.fetch({sort: order})
        },

        toggleTree: function (ev) {
            var $parent = $(ev.currentTarget.parentElement);
            var isCollapsed = $parent.hasClass('collapsed');
            console.log($parent);
            if (isCollapsed) {
                $parent.removeClass('collapsed');
            } else {
                $parent.addClass('collapsed');
            }
        }
    });
    return CommentTreeView;
});