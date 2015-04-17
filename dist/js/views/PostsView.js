/**
 * Created by Sergei on 17.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls"], function (Backbone, _, $, tpls) {
    var PostsView = Backbone.View.extend({
        template: tpls['RedditItem'],
        render: function () {
            this.$el.html(this.template(this.collection.toJSON()));
            return this;
        }
    });
    return PostsView;
});