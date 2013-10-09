snapshot.js

var extend = require('extend');
var util = require('util');
var v8type = require('v8type');


var snapshot_api  = function(){};



snapshot_api.prototype.add_snapshot = function(snapshot, callback){
    /*
     * snapshot_api.add_snapshot(snapshot, callback)
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
    if(!v8type.is(snapshot, v8type.OBJECT)){
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



    this.request('POST', '/graph/snapshot', {body: snapshot}, callback);
};


return module.exports = snapshot_api;
