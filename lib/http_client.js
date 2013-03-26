var https = require('https');
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
     *      'api_host': 'default is https://app.datadoghq.com',
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
	this.api_host = 'https://app.datadoghq.com';
    }


};

client.prototype.request = function(method, url, params, callback){
    if(arguments.length == 3 && v8type.is(arguments[2], v8type.FUNCTION)){
	params = {};
	callback = arguments[2];
    }
};

return module.exports = client;
