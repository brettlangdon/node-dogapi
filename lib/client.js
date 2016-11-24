var extend = require("extend");
var https = require("https");
var json = require("./json");
var url = require("url");
var util = require("util");
var os = require('os');

/*section: client
 *comment: |
 *  the constructor for _client_ object
 *params:
 *example: |
 *  See [client.request](#client-request)
 */
var client = function(){
    this.api_key = null;
    this.app_key = null;
    this.proxy_agent = null;
    this.api_version = "v1";
    this.api_host = "app.datadoghq.com";
};

/*section: client
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
client.prototype.request = function(method, path, params, callback){
    if(arguments.length === 3 && typeof arguments[2] === "function"){
        callback = arguments[2];
        params = {};
    }

    params = params || {};
    var body = (typeof params["body"] === "object") ? json.stringify(params["body"]) : params["body"];
    var query = {
        "api_key": this.api_key,
        "application_key": this.app_key,
    };

    if(typeof params["query"] === "object"){
        extend(query, params["query"]);
    }

    path = url.format({
        "pathname": util.format("/api/%s%s", this.api_version, path),
        "query": query,
    });

    function is_ipv4_loop_back(interface0) {
        // 169.254.xx.xx - loop back address for IPv4
        // if it exists all requests are redirected to localhost
        return interface0.address.indexOf('169.254.') === 0;
    }

    var isIPv6 = os.networkInterfaces().en0.find(is_ipv4_loop_back);
    var family = isIPv6 ? 6 : 4;

    var http_options = {
        hostname: this.api_host,
        port: 443,
        method: method.toUpperCase(),
        path: path,
        family: family
    };

    if(this.proxy_agent){
        http_options["agent"] = this.proxy_agent;
    }

    if(["POST", "PUT"].indexOf(http_options["method"]) >= 0){
        http_options["headers"] = {
            "Content-Type": params["contentType"] ? params["contentType"] : "application/json",
            "Content-Length": Buffer.byteLength(body),
        };
    }

    var req = https.request(http_options, function(res){
        res.on("error", function(err){
            if(typeof callback == "function"){
                callback(err, null, res.statusCode);
            }
        });

        var data = "";
        res.on("data", function(chunk){
            data += chunk;
        });

        res.on("end", function(){
            var error = null;
            try{ data = json.parse(data); }catch(e){}
            if(data["errors"]){
                error = data["errors"];
                data = null;
            }

            if(typeof callback === "function"){
                callback(error, data, res.statusCode);
            }
        });
    });

    // This should only occur for errors such as a socket hang up prior to any
    // data being received, or SSL-related issues.
    req.on("error", function(err){
        if(typeof callback === "function"){
            callback(err, null, 0);
        }
    });

    if(["POST", "PUT"].indexOf(http_options["method"]) >= 0){
        req.write(body);
    }
    req.end()
};

module.exports = new client();
