/**
 * Created by Sergei on 16.04.15.
 */
define(["backbone", "undersore", "jquery", "reddit"],
    function (Backbone, _, $, reddit) {
        var Posts = Backbone.Collection.extend({
            initialize: function () {
                console.log('Posts coll init');
            },
            _fetch : function(params){
                console.log(params);
                return new Promise(function(resolve, reject){
                    reddit.hot().fetch(function(res) {
                        console.log(res);
                        resolve(res);
                    });
                });
            },
            sync: function (method, model, options) {
                var self = this;
                switch (method) {
                    case 'read':
                        return self._fetch(options);
                        break;
                    default:
                        return Promise.reject(new Error('No such method'));
                        break;
                }
            }
        });
    });