var util = require('util');


var alert_api = function(){};

alert_api.prototype.add_alert = function(alert, callback){
    /*
     * alert_api.add_alert(alert, [callback])
     *
     * add a new alert to datadog
     *
     * `alert` is an object containing:
     *     query: *required*, the metric to query on
     *     name: name of the alert
     *     message: an optional message to include with the alert
     *     silenced: whether the alert should notify by email and in the stream
     *
     * `callback` an optional function to get called with the results of the api call
     *     callback(error, result, status_code)
    */
    if(typeof alert != 'object'){
        throw new Error('`alert` parameter must be an object');
    }

    if(!alert['query']){
        throw new Error('`alert["query"]` is required');
    }

    this.request('POST', '/alert', {body: alert}, callback);
};

alert_api.prototype.update_alert = function(alert_id, alert, callback){
    /*
     * alert_api.update_alert(alert_id, alert, [callback])
     *
     * update an existing alert
     *
     * `alert_id` the id of alert to update
     * `alert` is an object containing:
     *     query: *required*, the metric to query on
     *     name: name of the alert
     *     message: an optional message to include with the alert
     *     silenced: whether the alert should notify by email and in the stream
     *
     * `callback` an optional function to get called with the results of the api call
     *     callback(error, result, status_code)
    */
    if(typeof alert != 'object'){
    throw new Error('`alert` parameter must be an object');
    }

    if(!alert['query']){
        throw new Error('`alert["query"]` is required');
    }

    this.request('PUT', util.format('/alert/%s', alert_id), {body: alert}, callback);
};

alert_api.prototype.get_alert = function(alert_id, callback){
    /*
     * alert_api.get_alert(alert_id, [callback])
     *
     * get the details of an alert from the given id
     *
     * `alert_id` the id for the alert to get
     *
     * `callback` an optional function to call with the results
     *     callback(error, result, status_code)
    */
    this.request('GET', util.format('/alert/%s', alert_id), callback);
};

alert_api.prototype.delete_alert = function(alert_id, callback){
    /*
     * alert_api.delete_alert(alert_id, [callback])
     *
     * delete the given alert from datadog
     *
     * `alert_id` the id for the alert to get
     *
     * `callback` an optional function to call with the results
     *     callback(error, result, status_code)
    */
    this.request('DELETE', util.format('/alert/%s', alert_id), callback);
};

alert_api.prototype.get_all_alerts = function(callback){
    /*
     * alert_api.get_all_alerts([callback])
     *
     * get the details of all alerts in datadog
     *
     * `callback` an optional function to call with the results
     *     callback(error, result, status_code)
    */
    this.request('GET', '/alert', callback);
};

alert_api.prototype.mute_alerts = function(callback){
    /*
     * alert_api.mute_alerts([callback])
     *
     * mute all alerts
     *
     * `callback` an optional function to call with the results
     *     callback(error, result, status_code)
    */
    this.request('POST', '/mute_alerts', callback);
};

alert_api.prototype.unmute_alerts = function(callback){
    /*
     * alert_api.unmute_alerts([callback])
     *
     * unmute all alerts
     *
     * `callback` an optional function to call with the results
     *     callback(error, result, status_code)
    */
    this.request('POST', '/unmute_alerts', callback);
};

return module.exports = alert_api;
