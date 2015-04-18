/**
 * Created by Sergei on 14.04.15.
 */
(function (require) {
    require.config({
        'baseUrl': './js/',
        'findNestedDependencies': true,
        'paths': {
            "jquery": '../../bower_components/jquery/dist/jquery.min',
            "bootstrap": '../../bower_components/bootstrap/dist/js/bootstrap',
            "underscore": '../../bower_components/underscore/underscore-min',
            "backbone": '../../bower_components/backbone/backbone',
            "tpls": 'templates',
            "app": 'app',
            "utils": 'modules/utils',
            "reddit": '../../bower_components/reddit.js/reddit',
            "material" : "../../bower_components/bootstrap-material-design/dist/js/material.min",
            "ripples" : "../../bower_components/bootstrap-material-design/dist/js/ripples.min"
        },
        shim: {
            "reddit": {
                exports: 'reddit'
            },
            "bootstrap": {
                deps: ["jquery"]
            },
            "material": {
                deps: ["jquery", "bootstrap"]
            },
            "ripples": {
                deps: ["material"]
            }
        },
        deps: [
            "underscore",
            "jquery",
            "bootstrap",
            "material",
            "ripples",
            "utils"
        ]
    });

    require(['loader']);

})(require);