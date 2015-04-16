/**
 * Created by Sergei on 17.04.15.
 */
define(["app", "backbone", "underscore", "jquery"], function (App, Backbone, _, $) {
    var MainView = Backbone.View.extend({
        initialize: function () {
            console.log('Posts coll init');
        },
        events : {

        },
        template : App.tpls['Main'],
        render : function(){
            this.$el.html(this.template(this.model));
        }
    });

    return Posts;
});