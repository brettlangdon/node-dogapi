var util = require('util');
var v8type = require('v8type');


var alert_api = function(){};

alert_api.prototype.add_alert = function(alert, callback){
    if(!v8type.is(alert, v8type.OBJECT)){
	throw new Error('`alert` parameter must be an object');
    }

    if(!alert['query']){
	throw new Error('`alert["query"]` is required');
    }

    this.request('POST', '/alert', {body: alert}, callback);
};

alert_api.prototype.update_alert = function(alert_id, alert, callback){
    if(!v8type.is(alert, v8type.OBJECT)){
	throw new Error('`alert` parameter must be an object');
    }

    if(!alert['query']){
	throw new Error('`alert["query"]` is required');
    }

    this.request('PUT', util.format('/alert/%s', alert_id), {body: alert}, callback);
};

alert_api.prototype.get_alert = function(alert_id, callback){
    this.request('GET', util.format('/alert/%s', alert_id), callback)
};

alert_api.prototype.delete_alert = function(){
    this.request('DELETE', util.format('/alert/%s', alert_id), callback)
};

alert_api.prototype.get_all_alerts = function(callback){
    this.request('GET', '/alert', callback)
};

alert_api.prototype.mute_alerts = function(callback){
    this.request('POST', '/mute_alerts', callback)
};

alert_api.prototype.unmute_alerts = function(callback){
    this.request('POST', '/unmute_alerts', callback)
};

return module.exports = alert_api;
