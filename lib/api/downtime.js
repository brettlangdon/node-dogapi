var client = require("../client");
var util = require("util");

/*section: downtime
 *comment: schedule a new downtime
 *params:
 *  scope: string scope that the downtime should apply to (e.g. "env:staging")
 *  properties: |
 *    optional, an object containing any of the following
 *    * start: POSIX timestamp for when the downtime should start
 *    * end: POSIX timestamp for when the downtime should end
 *    * message: a string message to accompany the downtime
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.downtime.create("env:staging", function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function create(scope, properties, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = properties;
        properties = {};
    }

    var params = {
        body: {
            scope: scope
        }
    };
    if(typeof properties === "object"){
        if(properties.start){
            params.body.start = parseInt(properties.start);
        }
        if(properties.end){
            params.body.end = parseInt(properties.end);
        }
        if(properties.message){
            params.body.message = properties.message;
        }
    }
    client.request("POST", "/downtime", params, callback);
}

/*section: downtime
 *comment: update an existing downtime
 *params:
 *  downtimeId: the id the downtie to update
 *  properties: |
 *    optional, an object containing any of the following
 *    * scope: the scope the downtime should be changed to (e.g. "env:staging")
 *    * start: POSIX timestamp for when the downtime should start
 *    * end: POSIX timestamp for when the downtime should end
 *    * message: a string message to accompany the downtime
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var properties = {
 *    scope: "env:staging"
 *  };
 *  dogapi.downtime.update(1234, properties, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function update(downtimeId, properties, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = properties;
        properties = {};
    }
    var params = {
        body: {}
    };
    if(typeof properties === "object"){
        if(properties.scope){
            params.body.scope = properties.scope;
        }
        if(properties.start){
            params.body.start = parseInt(properties.start);
        }
        if(properties.end){
            params.body.end = parseInt(properties.end);
        }
        if(properties.message){
            params.body.message = properties.message;
        }
    }
    client.request("PUT", util.format("/downtime/%s", downtimeId), params, callback);
}

/*section: downtime
 *comment: delete a scheduled downtime
 *params:
 *  downtimeId: the id of the downtime
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.downtime.remove(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function remove(downtimeId, callback){
    client.request("DELETE", util.format("/downtime/%s", downtimeId), callback);
}

/*section: downtime
 *comment: get a scheduled downtimes details
 *params:
 *  downtimeId: the id of the downtime
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.downtime.get(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function get(downtimeId, callback){
    client.request("GET", util.format("/downtime/%s", downtimeId), callback);
}

/*section: downtime
 *comment: get all downtimes details
 *params:
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.downtime.getAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function getAll(callback){
    client.request("GET", "/downtime", callback);
}


module.exports = {
    create: create,
    update: update,
    remove: remove,
    get: get,
    getAll: getAll,
    getUsage: function(){
        return [
            "  dogapi downtime create <scope> [--start <start>] [--end <end>] [--message <message>]",
            "  dogapi downtime update <downtime-id> [--scope <scope>] [--start <start>] [--end <end>] [--message <message>]",
            "  dogapi downtime remove <downtime-id>",
            "  dogapi downtime get <downtime-id>",
            "  dogapi downtime getall",
        ];
    },
    getHelp: function(){
        return [
            "Downtime:",
            "  Subcommands:",
            "    create <scope>            create a new downtime with the provided scope (e.g. \"env:staging\")",
            "    update <downtime-id>      update an existing downtime with the provided id",
            "    remove <downtime-id>      remove the downtime with the provided id",
            "    get <downtime-id>         get the details of the downtime with the provided id",
            "    getall                    get the details of all downtimes",
            "",
            "  Options:",
            "    --start <start>           POSIX timestamp for when the downtime should start",
            "    --end <end>               POSIX timestamp for when the downtime should end",
            "    --message <message>       a string message to accompany the downtime",
            "    --scope <scope>           the scope of the downtime (e.g. \"env:staging\")"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "get"){
            get(args._[4], callback);
        } else if(subcommand === "getall"){
            getAll(callback);
        } else if(subcommand === "remove"){
            remove(args._[4], callback);
        } else if(subcommand === "create"){
            var scope = args._[4];
            var properties = {};
            if(args["start"]){
                properties.start = parseInt(args["start"]);
            }
            if(args["end"]){
                properties.end = parseInt(args["end"]);
            }
            if(args["message"]){
                properties.message = args["message"];
            }
            create(scope, properties, callback);
        } else if(subcommand === "update"){
            var downtimeId = args._[4];
            var properties = {};
            if(args["scope"]){
                properties.scope = args["scope"];
            }
            if(args["start"]){
                properties.start = parseInt(args["start"]);
            }
            if(args["end"]){
                properties.end = parseInt(args["end"]);
            }
            if(args["message"]){
                properties.message = args["message"];
            }
            update(downtimeId, properties, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi downtime --help` for help", false);
        }
    }
};
