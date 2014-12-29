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

return module.exports = snapshot_api;
