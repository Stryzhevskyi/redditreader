/**
 * Created by Sergei on 18.04.15.
 */
define(["backbone", "underscore", "jquery", "reddit"],
    function (Backbone, _, $, reddit) {
        'use strict';

        var Comments = Backbone.Model.extend({
            initialize: function () {
                console.log('Comments coll init');
            },

            post : {},

            _fetch: function (params) {
                console.log(params);
                var self = this;
                return new Promise(function (resolve, reject) {
                    var query = reddit.comments(params.id, params.section);
                    if (params.limit) {
                        query = query.limit(params.limit);
                    }
                    query = query.sort("best");

                    console.log(query);
                    query.fetch(function (res) {
                        console.log(res);
                        self.set(self.parse(res[1]));
                        self.post = res[0].data.children[0].data;
                        self.trigger('sync', self, res, params);
                        Backbone.channel.trigger('comments:sync');
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });
                });
            },

            parse: function (leav) {
                console.warn('parse', coll);
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

        return new Comments();
    });