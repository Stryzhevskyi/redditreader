/**
 * Created by Sergei on 17.04.15.
 */
define(["const", "backbone", "utils"], function (constants, Backbone, utils) {
    'use strict';
    var NavModel = Backbone.Model.extend({
        initialize: function () {
            var self = this;
            _.bindAll(this, 'updateSearch');
            this.listenTo(Backbone.channel, 'search:query', this.updateSearch);
            //this.on('change:search', function (data) {
            //
            //})
        },

        defaults: function () {
            return {
                id: 0,
                pageId: null,
                section: constants.SECTIONS[0],
                after: null,
                topic: null,
                comment: null,
                search: null
            }
        },
        /**
         *
         * @param {String} pageId
         * @param {String} section
         * @param {String} topic
         * @param {String} after
         */
        setState: function (pageId, section, topic, after) {
            this.set({
                pageId: pageId,
                section: section,
                after: after,
                topic: topic
            }, {silent: false});
        },

        _getUrl: function (section, after, opt) {
            opt = opt || {};
            var topic = this.get('topic');
            var section = section || this.get('section');
            var after = after || this.get('after');
            var pageId = this.get('pageId');
            var search = this.get('search');
            var url = '?';
            if (pageId)
                url += '/' + pageId;
            if (section) {
                url += '/s/' + section;
            } else if (topic !== null) {
                url += '/t/' + topic;
            }
            if (search && !opt.comment) {
                url += '/q/' + search;
            }
            if (opt.nav) return url;
            if (opt.comment) {
                url += '/c/' + opt.comment;
            }
            if (after) {
                url += '/a/' + after;
            }
            return url;

        },

        getNavBarObject: function () {
            var self = this;
            var topic = self.get('topic');
            var currentSection = self.get('section') || constants.SECTIONS[0];
            if (topic) {
                return [{
                    href: '?/' + self.get('pageId'),
                    name: self.get('pageId'),
                    isCurrent: true
                }];
            }
            var navbarList = _.map(constants.SECTIONS, function (section) {
                return {
                    href: self._getUrl(section, null, {nav: true}),
                    name: utils.capitalizeFirst(section),
                    isCurrent: section == currentSection
                }
            });
            console.log(navbarList);
            return navbarList;
        },

        /*?/:id/s/:section/a/:after*/
        getLinkPostsAfter: function (after) {
            return this._getUrl(null, after);
        },

        getPermalink: function (hash) {
            return this._getUrl(null, null, {comment: hash});
        },

        updateSearch: function (query) {
            if (this.get('search') !== query) {
                this.set(_.extend(this.defaults(), {
                    section: this.get('section'),
                    search: query
                }));
                Backbone.channel.trigger('search:fetch')
            }
        }
    });

    return new NavModel();
});