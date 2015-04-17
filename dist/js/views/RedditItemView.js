/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls"], function (Backbone, _, $, tpls) {
    var RedditItemView = Backbone.View.extend({
        template: tpls['RedditItem'],
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
    return RedditItemView;
});