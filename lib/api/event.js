var extend = require('extend');
var http_client = require('../http_client.js');
var v8type = require('v8type');


var event_api  = function(){};

event_api.prototype.stream = function(start, end, filter, callback){
    /*
     * event_api.stream( start, end, [[filter], callback] )
     *
     * function used to retrieve all events that have occured between
     * `start` and `end` (POSIX timestamps)
     *
     * optionally filter the query with `filter`:
     *    {
     *      'priority': ("low" or "normal"),
     *      'sources': ["sources", "as", "a", "list"],
     *      'tags': ["tags", "as", "a", "list"],
     *    }
     *
     * optionally provide a `callback` function to get the result
     * of this api call:
     *
     *    function(error, results)
    */
    if(arguments.length < 2){
	throw new Error('parameters `start` and `end` are required');
    }
    query = {
	start: parseInt(start),
	end: parseInt(end),
    };

    // this is the only case we have to check
    // if we have `event_api(1234, 5678, callback)` then
    // we want to push callback back
    if(arguments.length == 3 && v8type.is(arguments[2], v8type.FUNCTION)){
	callback = arguments[2];
	filter = {};
    }

    // validate the filters we were given and append to `query`
    // if they exist and meet their requirements
    if(filter['priority'] && ['low', 'normal'].indexOf(filter['priority'].toLowerCase()) >= 0){
	query['priority'] = filter['priority'].toLowerCase();
    }
    if(filter['sources'] && v8type.is(filter['sources'], v8type.ARRAY)){
	query['sources'] = filter['sources'].join();
    }
    if(filter['tags'] && v8type.is(filter['tags'], v8type.ARRAY)){
	query['tags'] = filter['tags'].join();
    }

    params = {
	query: query,
    };
    this.request('GET', '/events', params, callback);
};

event_api.prototype.get_event = function(event_id, callback){

};

event_api.prototype.add_event = function(){

};

event_api.prototype.add_comment = function(){

};

event_api.prototype.update_comment = function(){

};

event_api.prototype.delete_comment = function(){

};


return module.exports = event_api;
