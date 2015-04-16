define(function () {
var tpls = {};
tpls['Comment'] = function(o){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};__p+='';return __p;};
tpls['Main'] = function(o){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};__p+=''+((__t=( Date.now() ))==null?'':__t)+'';return __p;};
tpls['NavBar'] = function(o){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};__p+='<ul class="nav navbar-nav">\n    '; _.each(o.items, function(item){ __p+='\n        <li'+((__t=( item.isSelected ? 'class="active"' : '' ))==null?'':__t)+'>\n            <a data-section="'+((__t=( item.section ))==null?'':__t)+'" class="fake-link navlink">'+((__t=( item.name ))==null?'':__t)+'</a>\n        </li>\n    '; }); __p+='\n</ul>';return __p;};
tpls['Post'] = function(o){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};__p+='<div>\n    '+((__t=( o.name ))==null?'':__t)+'\n</div>';return __p;};
tpls['SubReddit'] = function(o){var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};__p+='<span>'+((__t=( link ))==null?'':__t)+'<b>'+((__t=( count ))==null?'':__t)+'</b></span>';return __p;};
return tpls;
});