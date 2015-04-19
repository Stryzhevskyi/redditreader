/**
 * Created by Sergei on 18.04.15.
 */
define(["backbone", "underscore", "jquery", "reddit", "const", "collections/Posts"],
    function (Backbone, _, $, reddit, constants, postsCollection) {
        'use strict';

        var Comments = Backbone.Model.extend({
            initialize: function () {
                console.log('Comments coll init');
            },

            defaults: function () {
                return {
                    commentOrder: constants.COMMENT_ORDER[0],
                    orders: constants.COMMENT_ORDER
                }
            },

            post: {},
            tree: {},
            lastParams: {
                section: constants.SECTIONS[0],
                limit: 200,
                sort: constants.COMMENT_ORDER[0]
            },

            _fetch: function (params) {
                var self = this;
                console.log(params);
                params = _.extend(this.lastParams, params);
                console.log(params);
                this.lastParams = params;
                return new Promise(function (resolve, reject) {
                    var query = reddit.comments(params.id, params.section);
                    if (params.limit) {
                        query = query.limit(params.limit);
                    }
                    if (params.sort) {
                        query = query.sort(params.sort);
                        self.set({'commentOrder': params.sort}, {silent: true});
                    }

                    console.log(query);
                    query.fetch(function (res) {
                        self.tree = self.parse(res[1]);
                        self.post = postsCollection.parse(res[0])[0];

                        self.set({
                            tree: self.tree,
                            post: self.post
                        });
                        self.trigger('sync', self, res, params);

                        Backbone.channel.trigger('comments:sync');
                        resolve(self.attributes);
                    }, function (error) {
                        reject(error);
                    });
                });
            },

            parse: function (node) {
                var self = this;
                if ('data' in node && 'children' in node.data) {
                    if ('count' in node.data) {
                        return {
                            count: node.data.count,
                            parent_id: node.data.parent_id,
                            replies: node.data.children,
                            name: node.data.name,
                            id: node.data.id
                        }
                    }
                    return node.data.children.map(function (child) {
                        return self.parse(child);
                    });
                } else if ('replies' in node) {
                    if (typeof node.replies !== 'string' && node.replies.data.children.length) {
                        node.replies = node.replies.data.children.map(function (child) {
                            return self.parse(child);
                        });
                    } else {
                        node.replies = [];
                    }

                    return node;
                } else {

                    return self.parse(node.data);
                }

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