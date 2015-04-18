/**
 * Created by Sergei on 17.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls"], function (Backbone, _, $, tpls) {
    'use strict';

    var CommentsListView = Backbone.View.extend({
        initialize: function (options) {
            _.bindAll(this, 'render', 'renderPost');
            this.template = tpls['CommentList.ejs'];
            this.listenTo(this.model, 'sync', this.render);
        },

        el: '#content',

        events : {
          'click .load-mode-comments' : 'loadMoreComments'
        },

        post : {},

        render: function () {
            console.log(this);
            this.$el.html(this.template({
                items: this.model.tree
            }));

            this.renderPost();

            return this;
        },

        renderPost : function(){
            this.$el.find('#post-wrapper').html(tpls['Post'](this.model.post));
        },

        loadMoreComments : function(ev){
            console.log('loadMoreComments', ev);
        }
    });
    return CommentsListView;
});