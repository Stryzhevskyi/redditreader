/**
 * Created by Sergei on 16.04.15.
 */
define(["backbone", "underscore", "jquery", "reddit"],
    function (Backbone, _, $, reddit) {
        var Posts = Backbone.Collection.extend({
            initialize: function () {
                console.log('Posts coll init');
            },
            before: null,
            after: null,
            _fetch: function (params) {
                console.log(params);
                var self = this;
                return new Promise(function (resolve, reject) {
                    var query = params.pageId
                        ? reddit[params.section](params.pageId)
                        : reddit[params.section]();
                    if (params.after) {
                        query = query.after(params.after);
                    } else if (params.before) {
                        query = query.before(params.before);
                    }

                    console.log(query);
                    query.fetch(function (res) {
                        console.log(res);
                        self.set(self.parse(res.data.children));
                        self.trigger('sync', self, res.data.children, params);
                        Backbone.channel.trigger('posts:sync', {before: res.data.before, after: res.data.after});
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });
                });
            },
            parse: function (coll) {
                return _.map(coll, function (el) {
                    var thumbnail = el.data.thumbnail;
                    if (thumbnail === 'nsfw' || thumbnail === 'self')
                        el.data.thumbnail = '';
                    return el.data;
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

        return new Posts();
    });