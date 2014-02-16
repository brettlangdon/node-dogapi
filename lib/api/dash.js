var util = require('util');

var validate_dashboard = function(dashboard){
    if(typeof dashboard != 'object'){
        throw new Error('`dashboard` parameter must be an object');
    }

    if(dashboard['title'] != 'string'){
        throw new Error('`dashboard["title"]` must be a string');
    }

    if(typeof dashboard['description'] != 'string'){
        throw new Error('`dashboard["description"]` must be a string');
    }

    if(typeof dashboard['graphs'] != 'object'){
        throw new Error('`dashboard["graphs"]` must be an array');
    }

    for(var i in dashboard['graphs']){
        if(!dashboard['graphs'][i]['title']){
            throw new Error(util.format('`dashboard["graphs"][%s]["title"]` is missing', i));
        }
        if(!dashboard['graphs'][i]['definition']){
            throw new Error(util.format('`dashboard["graphs"][%s]["definition"]` is missing', i));
        }
    }
};

var dash_api = function(){};

dash_api.prototype.get_dashboard = function(dash_id, callback){
    /*
     * dash_api.get_dashboard(dash_id, [callback])
     *
     * method to get a single dashboard information
     *
     * `dash_id` is the id of the dashboard to get information for
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, results, status_code)
    */
    this.request('GET', util.format('/dash/%s', dash_id), callback);
};

dash_api.prototype.get_all_dashboards = function(callback){
    /*
     * dash_api.get_all_dashboards([callback])
     *
     * method to retrieve all dashboards in datadog
     *
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    this.request('GET', '/dash', callback);
};

dash_api.prototype.create_dashboard = function(dashboard, callback){
    /*
     * dash_api.create_dashboard(dashboard, [callback])
     *
     * method used to create a new dashboard in datadog
     *
     * `dashboard` is the definition for the dashboard
     *      please see (http://docs.datadoghq.com/api/) for more information
     *
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    validate_dashboard(dashboard);
    this.request('POST', '/dash', {body: dashboard}, callback);
};

dash_api.prototype.update_dashboard = function(dash_id, dashboard, callback){
    /*
     * dash_api.update_dashboard(dash_id, dashboard, [callback])
     *
     * method used to update the dashboard with the provided `dash_id`
     *
     * `dash_id` the id of the dashboard to update
     * `dashboard` is a definition for the datadog dashboard
     *      please see (http://docs.datadoghq.com/api/) for more information
     *
     * `callback` an optional function to call with the results of the api call
     *    callback(error, result, status_code)
    */
    validate_dashboard(dashboard);
    this.request('PUT', util.format('/dash/%s', dash_id), {body: dashbboard}, callback);
};

dash_api.prototype.delete_dashboard = function(dash_id, callback){
    /*
     * dash_api.delete_dashboard(dash_id, [callback])
     *
     * method to remove a dashboard from datadog
     *
     * `dash_id` the id for the dashboard to remove
     * `callback` an optional function to call with the results of the api call
     *     callback(error, result, status_code)
    */
    this.request('DELETE', util.format('/dash/%s', dash_id), callback);
};

return module.exports = dash_api;
