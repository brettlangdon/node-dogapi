var v8type = require('v8type');


var metric_api = function(){};

metric_api.prototype.add_metric = function(metric, callback){
    var metrics = {
	'series': [metric]
    };
    this.add_metrics(metrics, callback);
};

metric_api.prototype.add_metrics = function(metrics, callback){
    if(!v8type.is(metrics, v8type.OBJECT)){
	throw new Error('`metrics` parameter must be an object');
    }

    if(!metrics['series'] || !v8type.is(metrics['series'], v8type.ARRAY)){
	throw new Error('`metrics["series"]` parameter must be an array');
    }

    for(var i in metrics['series']){
	var metric = metrics['series'][i];
	if(!metric['metric']){
	    throw new Error('metric["metric"] is required');
	}

	if(!metric['points'] || !v8type.is(metric['points'], v8type.ARRAY)){
	    throw new Error('metric["points"] must be an array');
	}
    }

    this.request('POST', '/series', {body: metrics}, callback);
};

return module.exports = metric_api;
