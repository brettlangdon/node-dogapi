var extend = require('extend');
var util = require('util');


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
     *    callback(error, result, status_code)
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
    if(arguments.length == 3 && typeof arguments[2] == 'function'){
        callback = arguments[2];
        filter = {};
    }

    // validate the filters we were given and append to `query`
    // if they exist and meet their requirements
    if(filter['priority'] && ['low', 'normal'].indexOf(filter['priority'].toLowerCase()) >= 0){
        query['priority'] = filter['priority'].toLowerCase();
    }
    if(filter['sources'] && typeof filter['sources'] == 'object'){
        query['sources'] = filter['sources'].join();
    }
    if(filter['tags'] && typeof filter['tags'] == 'object'){
        query['tags'] = filter['tags'].join();
    }

    params = {
        query: query,
    };
    this.request('GET', '/events', params, callback);
};

event_api.prototype.polling_stream = function(interval, filter, callback){
    /*
     * event_api.polling_stream(interval, [[filter], callback] )
     *
     * function used to continuously call `stream` for new events
     *
     * `interval` seconds between each call
     * `filter` is an object to limit the results by
     * `callback` is an optional function called with the results of the api call
     *      callback(error, result, status_code)
    */
    if(arguments.length < 3 && typeof arguments[1] == 'function'){
        callback = arguments[1];
        filter = {};
    }
    if(typeof filter != 'object'){
        throw new Error('`filter` parameter must be an object');
    }

    var last_run = new Date().getTime() / 1000;
    var self = this;
    setInterval(function(){
        var start = last_run;
        last_run = new Date().getTime() / 1000;
        self.stream(start, last_run, filter, callback);
    }, interval * 1000);

};

event_api.prototype.get_event = function(event_id, callback){
    /*
     * event_api.get_event(event_id, callback)
     *
     * method used to retrieve a single event's data
     *
     * `event_id` the id of the event to get the information for
     * `callback` an optional function called with the results
     *     callback(error, result, status_code)
    */
    if(!event_id){
        throw new Error('`event_id` parameter is required');
    }

    this.request('GET', util.format('/events/%s', event_id), callback);
};

event_api.prototype.add_event = function(event, callback){
    /*
     * event_api.add_event(event, callback)
     *
     * method used to add a new event to datadog
     *
     * `event` is an object containing any of the following:
     *     title: *required*, string, title for the new event
     *     text: *required*, string, event message
     *     date_happened: int, when the event occurred. if unset defaults to the current time. (POSIX timestamp)
     *     handle: string, user to post the event as. defaults to owner of the application key used to submit.
     *     priority: string, priority to post the event as. ("normal" or "low", defaults to "normal")
     *     related_event_id: post event as a child of the given event
     *     tags: array, tags to post the event with
     *     host: string, host to post the event with
     *     device_name: string, device_name to post the event with
     *     aggregation_ket: string, key to aggregate this event on
     *
     * `callback` is an optional function for the result
     *     callback(error, result, status_code)
    */
    if(typeof event != 'object'){
        throw new Error('`event` parameter must be an object');
    }

    if(!event['title']){
        throw new Error('`title` property of `event` parameter is required');
    }

    if(!event['text']){
        throw new Error('`text` property of `event` parameter is required');
    }

    if(!event['date_happened']){
        event['date_happened'] = Math.round((new Date()).getTime() / 1000);
    }

    if(event['priority']){
        if(['normal', 'low'].indexOf(event['priority'].toLowerCase()) == -1){
            event['priority'] = undefined;
        }
    }

    if(event['tags']){
        event['tags'] = event['tags'].join();
    }

    this.request('POST', '/events', {body: event}, callback);
};

event_api.prototype.add_comment = function(comment, callback){
    /*
     * event_api.add_comment(comment, [callback])
     *
     * method used to add a new comment to datadog
     *
     * `comment` is a object representation of the new comment:
     *     message: *require*, string, comment text body
     *     handle: string, optional handle name to use instead of owner of the app key
     *     related_event_id: string, optional event id to attach this comment to
     *
     * `callback` is an optional function for the result of the call
     *     callback(error, result, status_code)
    */
    if(typeof comment != 'object'){
        throw new Error('`comment` parameter must be an object');
    }

    if(!comment['message']){
        throw new Error('`message` property of `comment` paramter is required');
    }

    this.request('POST', '/comments', {body: comment}, callback);
};

event_api.prototype.update_comment = function(comment_id, comment, callback){
    /*
     * event_api.update_comment(comment_id, comment, callback)
     *
     * method used to update a comment that already exists in datadog
     *
     * `comment_id` is the id of the comment to update
     * `comment` an object representation of the comment changes to make
     *     message: string, the new message text for the comment
     *     handle: string, the new owner of the comment
     *
     * `callback` an optional callback to call with the result
     *     callback(error, result, status_code)
    */
    if(typeof comment != 'object'){
        throw new Error('`comment` parameter must be an object');
    }

    this.request('PUT', util.format('/comments/%s', comment_id), {body: comment}, callback);
};

event_api.prototype.delete_comment = function(comment_id, callback){
    /*
     * event_api.delete_comment(comment_id, callback)
     *
     * method used to remove a comment from datadog
     *
     * `comment_id` the comment id for the comment to remove
     * `callback` an optional function to handle the result
     *     callback(error, result, status_code)
     *
    */
    this.request('DELETE', util.format('/comments/%s', comment_id), callback);
};


return module.exports = event_api;
