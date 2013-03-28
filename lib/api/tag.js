var util = require('util');
var v8type = require('v8type');

var tag_api = function(){};

tag_api.prototype.search = function(query, callback){
    this.request('GET', '/search', {query: {'q': query}}, callback);
};

tag_api.prototype.all_tags = function(source, callback){
    if(arguments.length < 2 && v8type.is(arguments[0], v8type.FUNCTION)){
	callback = arguments[0];
	source = undefined;
    }

    params = {
	query: {
	    source: source
	}
    };
    this.request('GET', '/tags/hosts', params, callback);
};

tag_api.prototype.host_tags = function(host, source, callback){
    if(arguments.length < 3 && v8type.is(arguments[1], v8type.FUNCTION)){
	callback = arguments[1];
	source = undefined;
    }

    params = {
	query: {
	    source: source,
	}
    };
    this.request('GET', util.format('/tags/hosts/%s', host), params, callback);
};

tag_api.prototype.host_tags_by_source = function(host, source, callback){
    if(arguments.length < 3 && v8type.is(arguments[1], v8type.FUNCTION)){
	callback = arguments[1];
	source = undefined;
    }

    params = {
	query: {
	    source: source,
	    by_source: true,
	}
    };
    this.request('GET', util.format('/tags/hosts/%s', host), params, callback);
};

tag_api.prototype.add_tags = function(){

};

tag_api.prototype.change_tags = function(){

};

tag_api.prototype.detach_tags = function(){

};

return module.exports = tag_api;
