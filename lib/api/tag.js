var client = require("../client");
var util = require('util');


/*section: tag
 *comment: |
 *  get all host tags
 *params:
 *  source: |
 *    optional, only show tags for a particular source [default: null]
 *  callback: |
 *    function callback(err, res)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.tag.get_all(function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function get_all(source, callback){
    if(arguments.length < 2 && typeof arguments[0] === "function"){
        callback = source;
        source = undefined;
    }

    var params = {
        query: {
            source: source
        }
    };
    client.request("GET", "/tags/hosts", params, callback);
}

/*section: tag
 *comment: |
 *  get the host tags for a provided host name or host id
 *params:
 *  hostname: |
 *    the hostname or host id
 *  options:
 *    |
 *      optional, an object of options for the query allowing the following
 *      * source: the source of the tags (e.g. chef, puppet, users, etc) [default: null]
 *      * by_source: whether or not to group the results by source [default: false]
 *  callback: |
 *    function callback(err, res)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.tag.get("host.name", function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function get(hostname, options, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = options;
        options = {};
    }
    options = options || {};

    var params = {
        query: {
        }
    };
    if(options.source){
        params.query.source = options.source;
    }
    if(options.by_source){
        params.query.by_source = options.by_source;
    }
    client.request("GET", "/tags/hosts/" + hostname, params, callback);
};


/*section: tag
 *comment: |
 *  assign new host tags to the provided host name or host id
 *params:
 *  hostname: |
 *    the hostname or host id
 *  tags: |
 *    list of `<tag>:<value>` tags to assign to the server
 *  source: |
 *    optional, the source of the tags (e.g. chef, puppet, etc) [default: users]
 *  callback: |
 *    function callback(err, res)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.tag.create("host.name", ["role:webserver"], function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function create(hostname, tags, source, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = source;
        source = undefined;
    }

    var params = {
        body: {
            tags: tags,
            source: source
        },
    };

    client.request("POST", "/tags/hosts/" + hostname, params, callback);
};


/*section: tag
 *comment: |
 *  update the host tags for the provided host name or host id
 *params:
 *  hostname: |
 *    the hostname or host id
 *  tags: |
 *    list of `<tag>:<value>` tags to assign to the server
 *  source: |
 *    optional, the source of the tags (e.g. chef, puppet, etc) [default: users]
 *  callback: |
 *    function callback(err, res)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.tag.update("host.name", function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function update(hostname, tags, source, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = source;
        source = undefined;
    }

    var params = {
        body: {
            tags: tags,
            source: source
        },
    };
    client.request("PUT", "/tags/hosts/" + hostname, params, callback);
};

/*section: tag
 *comment: |
 *  delete the host tags for the provided host name or host id
 *params:
 *  hostname: |
 *    the hostname or host id
 *  source: |
 *    optional, the source of the tags (e.g. chef, puppet, etc) [default: users]
 *  callback: |
 *    function callback(err, res)
 *example: |
 *   ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.tag.delete("host.name", function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function delete_tags(hostname, source, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = source;
        source = undefined;
    }

    var params = {
        query: {
            source: source
        }
    };
    client.request("DELETE", "/tags/hosts/" + hostname, params, callback);
};

module.exports = {
    _client: client,
    get_all: get_all,
    get: get,
    create: create,
    update: update,
    "delete": delete_tags,
}
