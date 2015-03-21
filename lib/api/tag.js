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
 *   dogapi.tag.getAll(function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function getAll(source, callback){
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
 *   dogapi.tag.remove("host.name", function(err, results){
 *     console.dir(results);
 *   });
 *   ```
 */
function remove(hostname, source, callback){
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
    getAll: getAll,
    get: get,
    create: create,
    update: update,
    remove: remove,
    getUsage: function(){
        return [
            "  dogapi tag getall [--source <source>]",
            "  dogapi tag get <host> [--source <source>] [--by-source]",
            "  dogapi tag remove <host> [--source <source>]",
            "  dogapi tag create <host> <tags> [--source <source>]",
            "  dogapi tag update <host> <tags> [--source <source>]"
        ];
    },
    getHelp: function(){
        return [
            "Tag:",
            "  Subcommands:",
            "    getall               get all tags",
            "    get <host>            get all tags for a given host",
            "    remove <host>         delete tags for a given host",
            "    create <host> <tags>  add the comma separates \"tag:value\"'s from <tag> to <host>",
            "    update <host> <tags>  update the comma separates \"tag:value\"'s from <tag> to <host>",
            "",
            "  Options:",
            "    --source <source>     the source of the tags (e.g. \"chef\", \"user\", \"jenkins\", etc)",
            "    --by-source           whether the results should be grouped by source"
        ];
    },
    handleCli: function(subcommand, args, callback){
        var source = args["source"];
        var host = args._[4];

        if(subcommand === "getall"){
            getAll(source, callback);
        } else if(subcommand === "get"){
            var options = {};
            if(source){
                options.source = source;
            }
            if(args["by-source"]){
                options.by_source = true;
            }
            get(host, options, callback);
        } else if(subcommand === "create"){
            var tags = args._[5].split(",");
            create(host, tags, source, callback);
        } else if(subcommand === "update"){
            var tags = args._[5].split(",");
            update(host, tags, source, callback);
        } else if(subcommand === "delete"){
            remove(host, source, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi tag --help` for help", false);
        }
    }
}
