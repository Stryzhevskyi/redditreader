/**
 * Created by Sergei on 17.04.15.
 */
define(["backbone", "underscore", "jquery", "tpls"], function (Backbone, _, $, tpls) {
    var PostListView = Backbone.View.extend({
        initialize: function (options) {
            //this.collection.on('all', function(){
            //    console.log(arguments);
            //})
            _.bindAll(this, 'render');
            this.template = tpls['PostList'];
            this.listenTo(this.collection, 'sync', this.render);
        },

        el : '#postList',


        render: function () {
            console.log(this);
            this
                .$el
                .html(
                this.template(
                    {
                        items: this.collection.toJSON()
                    }
                )
            );
            return this;
        }
    });
    return PostListView;
});