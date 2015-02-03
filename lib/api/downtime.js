var util = require('util');

var downtime_api = function(){};

downtime_api.prototype.schedule_downtime = function(scope, options, callback){
    /*
     * downtime_api.schedule_downtime(scope, [options], [callback])
     *
     * method to schedule a new downtime
     *
     * `scope` the scope to schedule downtime for
     * `options` optional `start` `end` and `message` paramaters
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
     */
    if(typeof scope !== 'string'){
        throw new Error('scope parameter must be a string');
    }

    if(typeof options === 'function'){
        callback = options;
        options = {};
    }
    options.scope = scope;

    this.request('POST', '/downtime', {body: options}, callback);
};

downtime_api.prototype.update_downtime = function(downtime_id, options, callback){
    /*
     * downtime_api.update_downtime(downtime_id, [options], [callback])
     *
     * method to update an existing downtime
     *
     * `downtime_id` the id of the downtime
     * `options` optional `scope` `start` `end` and `message` paramaters
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
     */

    if(typeof options === 'function'){
        callback = options;
        options = {};
    }

    this.request('PUT', util.format('/downtime/%s', downtime_id), {body: options}, callback);
};

downtime_api.prototype.get_downtime = function(downtime_id, callback){
    /*
     * downtime_api.get_downtime(downtime_id, [callback])
     *
     * method to get an existing downtime
     *
     * `downtime_id` the id of the downtime
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
     */

    this.request('GET', util.format('/downtime/%s', downtime_id), callback);
};

downtime_api.prototype.cancel_downtime = function(downtime_id, callback){
    /*
     * downtime_api.cancel_downtime(downtime_id, [callback])
     *
     * method to cancel an existing downtime
     *
     * `downtime_id` the id of the downtime
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
     */

    this.request('DELETE', util.format('/downtime/%s', downtime_id), callback);
};

downtime_api.prototype.get_all_downtimes = function(current_only, callback){
    /*
     * downtime_api.get_all_downtimes(downtime_id, [current_only], [callback])
     *
     * method to get all downtimes
     *
     * `downtime_id` the id of the downtime
     * `current_only` whether or not to get the current downtime only
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
     */

    if(typeof current_only === 'function'){
        callback = current_only;
        current_only = false;
    }

    query = {};
    if(current_only){
        query.current_only = true;
    }

    this.request('GET', '/downtime', {query: query}, callback);
};

return module.exports = downtime_api;
