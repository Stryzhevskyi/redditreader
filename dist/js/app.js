/**
 * Created by Sergei on 14.04.15.
 */
define(["backbone", "const"], function (Backbone, constants) {
    var App = {
        start: function () {
            Backbone.history.start({pushState: true, root: "/dist/"});
        },
        navigate: function(url, trigger){
            trigger = (trigger === undefined) ? true : !!trigger;
            Backbone.history.navigate(url, {trigger : trigger});
        },
        channel : (function(){
            var channel = _.extend({}, Backbone.Events);
            channel.on('all', function(name, data){
                console.info(name, data);
            });
            return channel;
        })(),
        constants : constants,
        $root : $('#root'),
        $navbar : $('#navbar'),
    };
    window.App = App;
    return App;
});