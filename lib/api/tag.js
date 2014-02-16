var util = require('util');

var tag_api = function(){};


tag_api.prototype.all_tags = function(source, callback){
    /*
     * tag_api.all_tags([[source], callback])
     *
     * method to get all the tags in datadog
     *
     * `source` a source to limit to
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(arguments.length < 2 && typeof arguments[0] == 'function'){
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
    /*
     * tag_api.host_tags(host, [[source], callback])
     *
     * method to get the tags associated with a given `host`
     *
     * `host` the hostname or id to get tags for
     * `source` a source to limit the results to
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(arguments.length < 3 && typeof arguments[1] == 'function'){
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
    /*
     * tag_api.host_tags_by_source(host, [[source], callback])
     *
     * method to return the tags associated with a host, arranged by source
     *
     * `host` the hostname of id to get tags for
     * `source` a source to limit the lookup for
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(arguments.length < 3 && typeof arguments[1] == 'function'){
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

tag_api.prototype.add_tags = function(host, tags, source, callback){
    /*
     * tag_api.add_tags(host, tags, [[source], callback])
     *
     * add new tags to given `host`
     *
     * `host` the hostname or id of the machine to add tags for
     * `tags` an array of tags to add to the `host`
     * `source` the source to associate the tags with, default: user
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(typeof tags != 'object'){
        throw new Error('`tags` parameter must be an array');
    }

    if(arguments.length < 4 && typeof arguments[2] == 'function'){
        callback = arguments[2];
        source = undefined;
    }

    params = {
        query: {
            source: source,
        },
        body: {
            tags: tags,
        }
    };

    this.request('POST', util.format('/tags/hosts/%s', host), params, callback);
};

tag_api.prototype.update_tags = function(host, tags, source, callback){
    /*
     * tag_api.update_tags(host, tags, [[source], callback])
     *
     * update the tags associated with the given `host`
     *
     * `host` is the hostname or id of the machine to update tags for
     * `tags` an array of tags to associate with the `host`
     * `source` the source to associate the tags with, default: user
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(typeof tags != 'object'){
        throw new Error('`tags` parameter must be an array');
    }

    if(arguments.length < 4 && typeof arguments[2] == 'function'){
        callback = arguments[2];
        source = undefined;
    }

    params = {
        query: {
            source: source,
        },
        body: {
            tags: tags,
        }
    };

    this.request('PUT', util.format('/tags/hosts/%s', host), params, callback);
};

tag_api.prototype.detach_tags = function(host, source, callback){
    /*
     * tag_api.detach_tags(host, [[source], callback])
     *
     * method to remove tags for a given `host`
     *
     * `host` the hostname or id of the machine to remove the tags for
     * `source` the source of the tags
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    if(arguments.length < 3 && typeof arguments[1] == 'function'){
        callback = arguments[1];
        source = undefined;
    }

    params = {
        query: {
            source: source,
        },
    };

    this.request('DELETE', util.format('/tags/hosts/%s', host), params, callback);
};

return module.exports = tag_api;
