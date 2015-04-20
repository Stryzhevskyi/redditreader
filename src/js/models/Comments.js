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
                params = _.extend(this.lastParams, params);
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
                    query.fetch(function (res) {
                        if(reddit.silent){
                            resolve(res);
                            return ;
                        }
                        self.tree = self.parse(res[1]);
                        self.post = postsCollection.parse(res[0])[0];

                        self.set({
                            tree: self.tree,
                            post: self.post
                        });
                        self.trigger('sync', self, res, params);

                        Backbone.channel.trigger('comments:sync');
                        resolve(self);
                    }, function (error) {
                        reject(error);
                    });
                });
            },

            morechildren: function (id) {
                var self = this,
                    node = this.findInTree(id),
                    subreddit = this.get('post').name;
                console.log(id, node);
                return new Promise(function (resolve, reject) {
                    reddit.morechildren(node, subreddit).fetch(function (res) {
                        var comments = [];
                        if (res.json && res.errors && res.errors.length) {
                            reject(res.errors);
                            return;
                        }
                        if (res.json && res.json.data && res.json.data.things && res.json.data.things.length) {
                            debugger;
                            comments = _.pluck(res.json.data.things, 'data').map(function (node) {
                                if (typeof node.replies === 'string') node.replies = [];
                                return node;
                            });
                        }

                        /*update trr*/
                        node.parentNode.replies = node.parentNode.replies
                            .slice(0, -1)
                            .concat(comments);
                        self.trigger('node:modify', node.parentNode);

                        resolve(self);
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
            },

            /**
             *
             * Find comment item by id
             *
             * @param {String} id comment id
             * @param {Array} replies
             * @param {Object | null} result comment item
             * @returns {*}
             */
            findInTree: function (id, node, result) {
                node = node || {replies: this.attributes.tree};
                var self = this;
                node.replies.some(function (leaf) {
                    if (leaf.id == id) {
                        leaf.parentNode = node;
                        return result = leaf;
                    } else if ('count' in leaf && leaf.replies.indexOf(id) > -1) {
                        leaf.parentNode = node;
                        return result = leaf;
                    }
                    return false;
                });
                if (result) return result;

                node.replies.some(function (leaf) {
                    if (!('count' in leaf) && leaf.replies && leaf.replies.length) {
                        return result = self.findInTree(id, leaf, result);
                    }
                });

                return result;
            }
        });

        return new Comments();
    });