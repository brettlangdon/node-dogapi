const https = require('https');
const url = require('url');
const util = require('util');
const extend = require('extend');
const _ = require('lodash/fp');
const json = require('./json');

/* section: client
 *comment: |
 *  the constructor for _client_ object
 *params:
 *example: |
 *  See [client.request](#client-request)
 */
const DatadogMetricClient = function(options) {
  this.api_key = options.api_key || null;
  this.app_key = options.app_key || null;
  this.proxy_agent = options.proxy_agent || null;
  this.http_options = options.http_options || null;
  this.api_version = options.api_version || 'v1';
  this.api_host = options.api_host || 'app.datadoghq.com';
};

/* section: client
 *comment: |
 *  used to make a raw request to the datadog api
 *params:
 *  method: |
 *    http method GET, POST, PUT, DELETE
 *  path: |
 *    the api url path e.g. /tags/hosts
 *  params: |
 *    an object which allows the keys `query` or `body`
 *  callback: |
 *    function to call on success/failure callback(err, result)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.client.request("GET", "/url/path", {}, function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
DatadogMetricClient.prototype.request = function(method, path, params, callback) {
  if (arguments.length === 3 && typeof arguments[2] === 'function') {
    callback = arguments[2];
    params = {body: ''}; // create params with empty body property
  }

  const body = typeof params.body === 'object' ? json.stringify(params.body) : params.body;
  const query = {
    api_key: this.api_key,
    application_key: this.app_key
  };

  if (typeof params.query === 'object') {
    extend(query, params.query);
  }

  path = url.format({
    pathname: util.format('/api/%s%s', this.api_version, path),
    query
  });

  const http_options = _.assign(this.http_options, {
    hostname: this.api_host,
    port: 443,
    method: method.toUpperCase(),
    path
  });

  if (this.proxy_agent) {
    http_options.agent = this.proxy_agent;
  }

  if (['POST', 'PUT'].indexOf(http_options.method) >= 0) {
    http_options.headers = {
      'Content-Type': params.contentType ? params.contentType : 'application/json',
      'Content-Length': Buffer.byteLength(body)
    };
  }

  const req = https.request(http_options, function(res) {
    res.on('error', function(err) {
      if (typeof callback === 'function') {
        return callback(err, null, res.statusCode);
      }
    });

    let _data = '';
    res.on('data', function(chunk) {
      _data += chunk;
    });

    res.on('end', function() {
      let error = null;
      let data;

      try {
        data = json.parse(_data);
      } catch (e) {
        data = {};
      }
      if (data.errors) {
        error = data.errors;
        data = null;
      }

      if (typeof callback === 'function') {
        return callback(error, data, res.statusCode);
      }
    });
  });

  req.setTimeout(30000, function() {
    req.abort();
  });

  // This should only occur for errors such as a socket hang up prior to any
  // data being received, or SSL-related issues.
  req.on('error', function(err) {
    if (typeof callback === 'function') {
      return callback(err, null, 0);
    }
  });

  if (['POST', 'PUT'].indexOf(http_options.method) >= 0) {
    req.write(body);
  }
  req.end();
};

module.exports = DatadogMetricClient;
