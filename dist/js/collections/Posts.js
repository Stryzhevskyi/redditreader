/**
 * Created by Sergei on 16.04.15.
 */
define(["backbone", "underscore", "jquery", "reddit", "utils"],
    function (Backbone, _, $, reddit, utils) {
        'use strict';

        var Posts = Backbone.Collection.extend({
            initialize: function () {
                console.log('Posts coll init');
            },
            after: null,
            _fetch: function (params) {
                console.log(params);
                var self = this;
                return new Promise(function (resolve, reject) {
                    if (!reddit.hasOwnProperty(params.section)) {
                        params.section = 'hot';
                    }
                    if (params.search) {
                        Backbone.channel.trigger('search:query', params.search);
                        params.sort = params.section;
                    }
                    var query;
                    if (params.search) {
                        query = reddit
                            .search(params.search)
                            .sort(params.sort);
                    } else {
                        query = params.pageId
                            ? reddit[params.section](params.pageId)
                            : reddit[params.section]();
                    }
                    if (params.after) {
                        query = query.after(params.after);
                    } else if (params.before) {
                        query = query.before(params.before);
                    }

                    console.log(query);
                    query.fetch(function (res) {
                        console.log(res);
                        self.set(self.parse(res));
                        console.log(self.toJSON());
                        self.trigger('sync', self);
                        Backbone.channel.trigger('posts:sync', params);
                        resolve(res);
                    }, function (error) {
                        reject(error);
                    });
                });
            },
            parse: function (res) {
                var coll = res.data.children;
                this.after = res.data.after;
                return _.map(coll, function (el) {
                    var thumbnail = el.data.thumbnail;
                    if (thumbnail === 'nsfw' || thumbnail === 'self' || thumbnail === 'default') {
                        el.data.thumbnailClassName = thumbnail;
                        el.data.thumbnail = null;
                    }
                    if (el.data.selftext_html) {
                        el.data.selftext_html = utils.decodeHtml(el.data.selftext_html)
                    }
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