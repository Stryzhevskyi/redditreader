/**
 * Created by Sergei on 17.04.15.
 */
define(["const", "backbone", "utils", "collections/Posts"], function (constants, Backbone, utils, postCollection) {
    var NavModel = Backbone.Model.extend({
        defaults: function () {
            return {
                id: 0,
                pageId: null,
                section: constants.SECTIONS[0],
                after: null,
                topic: null
            }
        },
        /**
         *
         * @param {String} pageId
         * @param {String} section
         * @param {String} after
         * @param {String} topic
         */
        setState: function (pageId, section, after, topic) {
            this.set({
                pageId: pageId,
                section: section,
                after: after,
                topic: topic
            });
        },

        _getNavUrl: function (section) {
            var topic = this.get('topic');
            var after = this.get('after');
            var pageId = this.get('pageId');
            var url = '';
            if(pageId){
                url += pageId + '/s/' + section;
                if (topic !== null) {
                    url += '/t/' + topic;
                }else if(after){
                    url += '/a/' + after;
                }
            }else{
                url += 's/' + section;
            }


            return url;

        },

        getNavBarObject: function () {
            var self = this;
            var topic = self.get('topic');
            if(topic){
                return [{
                    href : self.get('pageId'),
                    name : self.get('pageId'),
                    isCurrent : false
                }];
            }
            var navbarList = _.map(constants.SECTIONS, function (section) {
                return {
                    href: self._getNavUrl(section),
                    name: utils.capitalizeFirst(section),
                    isCurrent: section == self.get('section')
                }
            });
            console.log(navbarList);
            return navbarList;
        }
    });

    return new NavModel();
});