var extend = require('extend');
var https = require('https');
var url = require('url');
var util = require('util');
var v8type = require('v8type');


var client = function(options){
    /*
     * new http_client([options])
     *
     * http client used to make requests to datadog api service
     *
     * `options` is an optional object of parameters to set:
     *    {
     *      'api_key': 'datadog api key',
     *      'app_key': 'datadog app key',
     *      'api_version': 'default is v1',
     *      'api_host': 'default is app.datadoghq.com',
     *    }
     *
     * this client also allows you to provide these options as
     * environment variables instead:
     *
     *    api_key: DD_API_KEY
     *    app_key: DD_APP_KEY
     *    api_version: DD_API_VERSION
     *    api_host: DD_API_HOST
    */
    options = (options)? options : {};

    this.api_key = (options['api_key'])? options['api_key'] : process.env['DD_API_KEY'];
    if(!this.api_key){
	throw new Error('`api_key` is not present, either provide `api_key` in `options` or use environment variable `DD_API_KEY`');
    }

    this.app_key = (options['app_key'])? options['app_key'] : process.env['DD_APP_KEY'];
    if(!this.api_key){
	throw new Error('`app_key` is not present, either provide `app_key` in `options` or use environment variable `DD_APP_KEY`');
    }

    this.api_version = (options['api_version'])? options['api_version'] : process.env['DD_API_VERSION'];
    if(!this.api_version){
	this.api_version = 'v1';
    }

    this.api_host = (options['api_host'])? options['api_host'] : process.env['DD_API_HOST'];
    if(!this.api_host){
	this.api_host = 'app.datadoghq.com';
    }


};

client.prototype.request = function(method, path, params, callback){
    /*
     * http_client.request(method, path, [[params], callback])
     *
     * method used to send an http request to the datadog api service
     *
     * `method` is the http method to use ('POST', 'GET', 'DELETE', etc)
     * `path` the api url to call, e.g '/events', '/series', '/dash', etc
     * `params` an optional object of additional options:
     *     {
     *       'query': { 'key': 'value' },
     *       'body': { 'json/object': 'body' } or 'string body',
     *     }
     * `callback` an optional function to obtain the results of the api call
     *     callback(error, result)
    */
    if(arguments.length == 3 && v8type.is(arguments[2], v8type.FUNCTION)){
	callback = arguments[2];
	params = {};
    }

    params = params || {};
    var body = v8type.is(params['body'], v8type.OBJECT)? JSON.stringify(params['body']) : params['body'];
    var query = {
	'api_key': this.api_key,
	'application_key': this.app_key,
    };

    if(v8type.is(params['query'], v8type.OBJECT)){
	extend(query, params['query']);
    }

    path = url.format({
	'pathname': util.format('/api/%s%s', this.api_version, path),
	'query': query,
    });

    var http_options = {
	hostname: this.api_host,
	port: 443,
	method: method.toUpperCase(),
	path: path,
    };

    if(http_options['method'] == 'POST'){
	http_options['headers'] = {
	    'Content-Type': 'application/json',
	    'Content-Length': body.length,
	};
    }

    var req = https.request(http_options, function(res){
	res.on('error', function(err){
	    if(v8type.is(callback, v8type.FUNCTION)){
		callback(err, null, res.statusCode);
	    }
	});

	var data = '';
	res.on('data', function(chunk){
	    data += chunk;
	});

	res.on('end', function(){
	    if(res.headers['content-type'] == 'application/json'){
		data = JSON.parse(data);
	    }

	    if(v8type.is(callback, v8type.FUNCTION)){
		callback(null, data, res.statusCode);
	    }
	});
    });

    if(http_options['method'] == 'POST'){
	req.write(body);
    }
    req.end()
};

return module.exports = client;
