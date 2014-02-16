var metric_api = function(){};

metric_api.prototype.add_metric = function(metric, callback){
    /*
     * metric_api.add_metric(metric, [callback])
     *
     * method used to add a single metric to datadog
     *
     * `metric` an object representation of the metric
     *     metric: *required*, the name of the metric
     *     points: *required*, an array of elements [ timestamp, value ]
     *     host: name of the host that produced the event
     *     tags: array of tags to associate with the event
     *     type: "guage" or "counter"
     *
     * `callback` an optional function to call with the results
     *     callback(metric, [callback])
    */
    var metrics = {
        'series': [metric]
    };
    this.add_metrics(metrics, callback);
};

metric_api.prototype.add_metrics = function(metrics, callback){
    /*
     * metric_api.add_metrics(metrics, [callback])
     *
     * method used to add multiple metrics to datadog
     *
     * `metrics` an object representation of the metric:
     *     series: an array of `metrics` to add
     *
     * `callback` an optional function to call with the results
     *     callback(metric, [callback])
    */
    if(typeof metrics != 'object'){
        throw new Error('`metrics` parameter must be an object');
    }

    if(!metrics['series'] || typeof metrics['series'] != 'object'){
        throw new Error('`metrics["series"]` parameter must be an array');
    }

    for(var i in metrics['series']){
        var metric = metrics['series'][i];
        if(!metric['metric']){
            throw new Error('metric["metric"] is required');
        }

        if(!metric['points'] || typeof metric['points'] != 'object'){
            throw new Error('metric["points"] must be an array');
        }
    }

    this.request('POST', '/series', {body: metrics}, callback);
};

return module.exports = metric_api;
