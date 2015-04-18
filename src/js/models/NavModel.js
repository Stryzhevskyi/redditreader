/**
 * Created by Sergei on 17.04.15.
 */
define(["const", "backbone", "utils"], function (constants, Backbone, utils) {
    'use strict';
    var NavModel = Backbone.Model.extend({
        defaults: function () {
            return {
                id: 0,
                pageId: null,
                section: constants.SECTIONS[0],
                after: null,
                topic: null,
                comment: null
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
            }, {silent: true});
        },

        _getUrl: function (section, after, opt) {
            opt = opt || {};
            var topic = this.get('topic');
            var section = section || this.get('section');
            var after = after || this.get('after');
            var pageId = this.get('pageId');
            var url = '?';
            if (pageId)
                url += '/' + pageId;
            if (section) {
                url += '/s/' + section;
            } else if (topic !== null) {
                url += '/t/' + topic;
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
            if (topic) {
                return [{
                    href: self.get('pageId'),
                    name: self.get('pageId'),
                    isCurrent: true
                }];
            }
            var navbarList = _.map(constants.SECTIONS, function (section) {
                return {
                    href: self._getUrl(section, null, {nav: true}),
                    name: utils.capitalizeFirst(section),
                    isCurrent: section == self.get('section')
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
        }
    });

    return new NavModel();
});