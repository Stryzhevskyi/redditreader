## [Semi-final task for  UA Web Challenge VII (Front-end developer | JavaScript Middle/Senior)](https://stryzhevskyi.github.io/redditreader/?/)
[![Reddit Reader](https://stryzhevskyi.github.io/redditreader/img/icon-sm.png)](https://stryzhevskyi.github.io/redditreader/?/)

###Build
```sh
bower install && npm install
bower #build + watch
bower dist #build with r.js + UglifyJS2
./bin/icons ./src/img/icon.png #build images
```

###Technologies & Tools & Libraries
* [Service Worker](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/)
* Promise
* Gulp
* RequireJS + r.js
* Backbone + Underscore
* Twitter Bootstrap 3 + [Material Design](http://fezvrasta.github.io/bootstrap-material-design/) + [SnackbarJS](http://fezvrasta.github.io/snackbarjs/) 
* Web Application mode (you can add shortcut to Android/iOS desktop)


###Tips
```js
var App = require('app');
/*show short info about caches*/
App.sw.getStatus().then(function(data){
   console.log(data);
});
/*add data to dynamic cache*/
App.sw.cacheUrls([
   'https://www.reddit.com/r/funny/comments/334w6q.json?limit=200&sort=top'
]).then(function(data){
   console.log(data);
});
/*delete data from cashes (all)*/
App.sw.deleteUrls([
   'https://www.reddit.com/r/funny/comments/334w6q.json?limit=200&sort=top'
]).then(function(data){
   console.log(data)
});
```