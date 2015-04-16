/**
 * Created by Sergei on 17.04.15.
 */
define(["const", "underscore"], function (constants, _) {
    var utils = new function () {
        var self = this;
        self.capitalizeFirst = function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        self.getNavbarList = function () {
            return _.map(constants.SECTIONS, function (section) {
                return {
                    href: section,
                    name: self.capitalizeFirst(section)
                }
            });
        }
    };

    return utils;
});