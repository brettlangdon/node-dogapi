var extend = require('extend');
var util = require('util');

var snapshot_api  = function(){};

snapshot_api.prototype.add_snapshot = function(snapshot, callback){
    /*
     * snapshot_api.add_snapshot(snapshot, [callback])
     *
     * method used to add a new snapshot to datadog
     *
     * `snapshot` is an object containing any of the following:
     *     metric_query: *required*, The metric query.
     *     start: *required*, int, Start of the query.(POSIX timestamp)
     *     end: *required*, int, End of the query.(POSIX timestamp)
     *     event_query: A query that will add event bands to the graph.
     *
     * `callback` is an optional function for the result
     *     callback(error, result, status_code)
    */
    if(typeof snapshot != 'object'){
        throw new Error('`snapshot` parameter must be an object');
    }

    if(!snapshot['metric_query']){
        throw new Error('`metric_query` property of `snapshot` parameter is required');
    }

    if(!snapshot['start']){
        throw new Error('`start` property of `snapshot` parameter is required');
    }

    if(!snapshot['end']){
        throw new Error('`end` property of `snapshot` parameter is required');
    }

    this.request('GET', '/graph/snapshot', {query: snapshot}, callback);
};

snapshot_api.prototype.add_snapshot_from_def = function(snapshot, callback){
    /*
     * snapshot_api.add_snapshot_from_def(snapshot, [callback])
     *
     * method used to add a new snapshot to datadog based on a graph definition
     * https://github.com/DataDog/dogapi/commit/583f13d7bd8de5a86daa2ff53f2d7cf6570e7ab2
     * feature is not currently documented (at time of writing), but very useful.
     *
     * `snapshot` is an object containing any of the following:
     *     graph_def: *required*, JSON string dump of an existing graph definition
     *     start: *required*, int, Start of the query.(POSIX timestamp)
     *     end: *required*, int, End of the query.(POSIX timestamp)
     *
     * `callback` is an optional function for the result
     *     callback(error, result, status_code)
    */
    if(typeof snapshot != 'object'){
        throw new Error('`snapshot` parameter must be an object');
    }

    if(!snapshot['graph_def']){
        throw new Error('`graph_def` property of `snapshot` parameter is required');
    }

    if(!snapshot['start']){
        throw new Error('`start` property of `snapshot` parameter is required');
    }

    if(!snapshot['end']){
        throw new Error('`end` property of `snapshot` parameter is required');
    }

    this.request('GET', '/graph/snapshot', {query: snapshot}, callback);
};

snapshot_api.prototype.snapshot_status = function(snapshot_url, callback){
    /*
     * snapshot_api.add_snapshot(snapshot_url, [callback])
     *
     * method used to check the status of a datadog snapshot.
     * https://github.com/DataDog/dogapi/blob/master/src/dogapi/http/snapshot.py#L64
     * Snapshot URLs are returned right away, but may be empty if the query or graph is complicated.
     * Result will be a json payload, with 403 for incomplete, or 200 for complete.
     * Examples:
     *  * {"status_code":403} - incomplete (still processing, image is empty)
     *  * {"status_code":200} - image is rendered and ready
     *
     * `snapshot_url` is a string containing URL returned from a call to add_snapshot or add_snapshot_from_def
     *
     * `callback` is an optional function for the result
     *     callback(error, result, status_code)
    */
    if(typeof snapshot_url != 'string'){
        throw new Error('`snapshot_url` parameter must be a string');
    }

    url = snapshot_url.split('/snapshot/view/')[1].split('.png')[0]

    this.request('GET', '/graph/snapshot_status/'+url, {}, callback);
};

return module.exports = snapshot_api;
