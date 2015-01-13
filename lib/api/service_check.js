var util = require('util');

var constants = require('../constants');

var service_check_api = function(){};


service_check_api.prototype.service_check = function(status, check, host, extra, callback){
    /*
     * service_check_api.service_check(options, callback])
     *
     * used to post a service check
     *
     * `status` the `dogapi.constant.STATUSES` status code for the check
     * `check` the name of the check
     * `host` the host associated with the check
     * `extra` an object of optional arguments `timestamp`, `message` or `tags`
     * `callback` is an optional function to call with the results of the api call
     *     callback(error, result, status_code)
     */
    if(typeof extra === 'function'){
        callback = extra;
        extra = {};
    }

    if(constants.ALL_STATUSES.indexOf(status) < 0){
        throw new Error(util.format('Unknown service_check status %s', status));
    }

    var body = {
        check: check,
        status: status,
        host_name: host,
        timestamp: parseInt(extra['timestamp'] || (new Date().getTime() / 1000)),
    };

    if(extra['message']){
        body['message'] = extra['message'];
    }
    if(extra['tags']){
        body['tags'] = extra['tags'];
    }

    this.request('POST', '/check_run', {body: body}, callback);
};

return module.exports = service_check_api;
