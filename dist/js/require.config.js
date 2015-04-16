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
            "reddit": '../../bower_components/reddit.js/reddit'
        },
        shim : {
            "reddit" : {
                exports : 'reddit'
            },
            "bootstrap" : {
                deps : ["jquery"]
            }
        },
        deps: [
            "underscore",
            "jquery",
            "bootstrap",
            "utils"
        ]
    });

    require(['loader']);

})(require);