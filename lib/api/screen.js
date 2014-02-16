var util = require('util');

var validate_screenboard = function(screenboard){
    if(typeof screenboard != 'object'){
        throw new Error('`screenboard` parameter must be an object');
    }

    if(typeof screenboard['board_title'] != 'string'){
        throw new Error('`screenboard["board_title"]` must be a string');
    }

    if(screenboard['width'] != undefined && typeof screenboard['width'] != 'number'){
        throw new Error('`screenboard["width"]` must be a number');
    }

    if(screenboard['height'] != undefined && typeof screenboard['height'] != 'number'){
        throw new Error('`screenboard["height"]` must be a number');
    }

    if(typeof screenboard['widgets'] != 'object'){
        throw new Error('`screenboard["widgets"]` must be an array');
    }

    for(var i in screenboard['widgets']){
        if(!screenboard['widgets'][i]['type']){
            throw new Error(util.format('`screenboard["widgets"][%s]["type"]` is missing', i));
        }
        if(!screenboard['widgets'][i]['width']){
            throw new Error(util.format('`screenboard["widgets"][%s]["width"]` is missing', i));
        }
        if(!screenboard['widgets'][i]['height']){
            throw new Error(util.format('`screenboard["widgets"][%s]["height"]` is missing', i));
        }
        if(!screenboard['widgets'][i]['x']){
            throw new Error(util.format('`screenboard["widgets"][%s]["x"]` is missing', i));
        }
        if(!screenboard['widgets'][i]['y']){
            throw new Error(util.format('`screenboard["widgets"][%s]["y"]` is missing', i));
        }
    }
};

var screen_api = function(){};

screen_api.prototype.get_screenboard = function(screen_id, callback){
    /*
     * screen_api.get_screenboard(screen_id, [callback])
     *
     * method to get a single screenboard information
     *
     * `screen_id` is the id of the screenboard to get information for
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
    */
    this.request('GET', util.format('/screen/%s', screen_id), callback);
};

screen_api.prototype.get_all_screenboards = function(callback){
    /*
     * screen_api.get_all_screenboards([callback])
     *
     * method to retrieve all screenboards in datadog
     *
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    this.request('GET', '/screen', callback);
};

screen_api.prototype.create_screenboard = function(screenboard, callback){
    /*
     * screen_api.create_screenboard(screenboard, [callback])
     *
     * method used to create a new screenboard in datadog
     *
     * `screenboard` is the definition for the screenboard
     *      please see (http://docs.datadoghq.com/api/) for more information
     *
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    validate_screenboard(screenboard);
    this.request('POST', '/screen', {body: screenboard}, callback);
};

screen_api.prototype.update_screenboard = function(screen_id, screenboard, callback){
    /*
     * screen_api.update_screenboard(screen_id, screenboard, [callback])
     *
     * method used to update the screenboard with the provided `screen_id`
     *
     * `screen_id` the id of the screenboard to update
     * `screenboard` is a definition for the datadog screenboard
     *      please see (http://docs.datadoghq.com/api/) for more information
     *
     * `callback` an optional function to call with the results of the api call
     *    callback(error, result, status_code)
    */
    validate_screenboard(screenboard);
    this.request('PUT', util.format('/screen/%s', screen_id), {body: screenboard}, callback);
};

screen_api.prototype.delete_screenboard = function(screen_id, callback){
    /*
     * screen_api.delete_screenboard(screen_id, [callback])
     *
     * method to remove a screenboard from datadog
     *
     * `screen_id` the id for the screenboard to remove
     * `callback` an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    this.request('DELETE', util.format('/screen/%s', screen_id), callback);
};

return module.exports = screen_api;
