var client = require("../client");
var util = require("util");

/*section: monitor
 *comment: create a new monitor
 *params:
 *  type: one of "metric alert" or "service check"
 *  query: the monitor query to use, you probably want to read datadog's [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
 *  properties: |
 *    optional, an object containing any of the following
 *    * name: the name of the monitor
 *    * message: the message for the monitor
 *    * tags: a list of strings as tags to associate with the monitor
 *    * options: an object, to see available options please see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var metricType = "metric alert";
 *  var query = "avg(last_1h):sum:system.net.bytes_rcvd{host:host0} > 100";
 *  dogapi.monitor.create(metricType, query, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function create(type, query, properties, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = properties;
        properties = {};
    }

    var params = {
        body: {
            type: type,
            query: query
        }
    };

    if(typeof properties === "object"){
        if(properties.name){
            params.body.name = properties.name;
        }
        if(properties.message){
            params.body.message = properties.message;
        }
        if(properties.tags){
            params.body.tags = properties.tags;
        }
        if(typeof properties.options === "object"){
            params.body.options = properties.options;
        }
    }
    client.request("POST", "/monitor", params, callback);
}

/*section: monitor
 *comment: get an existing monitor's details
 *params:
 *  monitorId: the id of the monitor
 *  groupStates: an array containing any of the following "all", "alert", "warn", or "no data"
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.monitor.get(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function get(monitorId, groupStates, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = groupStates;
        groupStates = undefined;
    }

    var params = {};
    if(groupStates){
        params.query = {
            group_states: groupStates.join(",")
        };
    }

    client.request("GET", util.format("/monitor/%s", monitorId), params, callback);
}

/*section: monitor
 *comment: get all monitors
 *params:
 *  options: |
 *    optional, an object containing any of the following
 *    * group_states: an array containing any of the following "all", "alert", "warn", or "no data"
 *    * tags: an array of "tag:value"'s to filter on
 *    * monitor_tags: a comma separated list indicating what service and/or custom tags
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.monitor.getAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function getAll(options, callback){
    if(arguments.length < 2 && typeof arguments[0] === "function"){
        callback = options;
        options = {};
    }
    var params = {};
    if(typeof options === "object"){
        params.query = {};
        if(options.group_states){
            params.query.group_states = options.group_states.join(",");
        }
        if(options.tags){
            params.query.tags = options.tags.join(",");
        }
        if(options.monitor_tags){
            params.query.monitor_tags = options.monitor_tags.join(",");
        }
    }
    client.request("GET", "/monitor", params, callback);
}

/*section: monitor
 *comment: update a monitor's details
 *params:
 *  monitorId: the id of the monitor to edit
 *  query: the query that the monitor should have, see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs for more info
 *  properties: |
 *    optional, an object containing any of the following
 *    * name: the name of the monitor
 *    * message: the message for the monitor
 *    * tags: a list of strings as tags to associate with the monitor
 *    * options: an object, to see available options please see the [monitor create](http://docs.datadoghq.com/api/#monitor-create) docs
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var query = "avg(last_1h):sum:system.net.bytes_rcvd{host:host0} > 100";
 *  dogapi.monitor.update(1234, query, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function update(monitorId, query, properties, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = properties;
        properties = {};
    }

    var params = {
        body: {
            query: query
        }
    };

    if(typeof properties === "object"){
        if(properties.name){
            params.body.name = properties.name;
        }
        if(properties.message){
            params.body.message = properties.message;
        }
        if(properties.tags){
            params.body.tags = properties.tags;
        }
        if(typeof properties.options === "object"){
            params.body.options = properties.options;
        }
    }
    client.request("PUT", util.format("/monitor/%s", monitorId), params, callback);
}

/*section: monitor
 *comment: delete an existing monitor
 *params:
 *  monitorId: the id of the monitor to remove
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.monitor.remove(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function remove(monitorId, callback){
    client.request("DELETE", util.format("/monitor/%s", monitorId), callback);
}

/*section: monitor
 *comment: mute an existing monitor
 *params:
 *  monitorId: the id of the monitor to mute
 *  options: |
 *    optional, an object containing any of the following
 *    * scope: the scope to mute (e.g. "role:db")
 *    * end: POSIX timestamp indicating when the mute should end
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.monitor.mute(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function mute(monitorId, options, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = options;
        options = {};
    }
    var params = {};
    if(typeof options === "object"){
        params.body = {};
        if(options.scope){
            params.body.scope = options.scope;
        }
        if(options.end){
            params.body.end = parseInt(options.end);
        }
    } else {
        params.body = "";  // create empty body
    }
    client.request("POST", util.format("/monitor/%s/mute", monitorId), params, callback);
}

/*section: monitor
 *comment: mute all monitors
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
 *  dogapi.monitor.muteAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function muteAll(callback){
    client.request("POST", "/monitor/mute_all", callback);
}

/*section: monitor
 *comment: unmute an existing monitor
 *params:
 *  monitorId: the id of the monitor to unmute
 *  scope: optional, a scope to apply the unmute to (e.g. "role:db")
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.monitor.unmute(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function unmute(monitorId, scope, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = scope;
        scope = undefined;
    }
    var params = {};
    if(scope){
        params.body = {
            scope: scope
        };
    } else {
        params.body = "";  // create empty body
    }
    client.request("POST", util.format("/monitor/%s/unmute", monitorId), params, callback);
}

/*section: monitor
 *comment: unmute all monitors
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
 *  dogapi.monitor.unmuteAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function unmuteAll(callback){
    client.request("POST", "/monitor/unmute_all", callback);
}

module.exports = {
    create: create,
    get: get,
    update: update,
    remove: remove,
    getAll: getAll,
    mute: mute,
    muteAll: muteAll,
    unmute: unmute,
    unmuteAll: unmuteAll,
    getUsage: function(){
        return [
            "  dogapi monitor create <type> <query> [--name <name>] [--message <message>]",
            "  dogapi monitor get <monitor-id> [--states <states>]",
            "  dogapi monitor getall [--states <states>] [--tags <tags>]",
            "  dogapi monitor mute <monitor-id> [--scope <scope>] [--end <end>]",
            "  dogapi monitor muteall",
            "  dogapi monitor remove <monitor-id>",
            "  dogapi monitor unmute <monitor-id> [--scope <scope>]",
            "  dogapi monitor unmuteall",
            "  dogapi monitor update <monitor-id> <query> [--name <name>] [--message <message>]"
        ];
    },
    getHelp: function(){
        return [
            "Monitor:",
            "  Subcommands:",
            "    create <type> <query>          create a new monitor",
            "    get <monitor-id>               get a monitors details",
            "    getall                         get a list of all monitors",
            "    mute <monitor-id>              mute the monitor with the id <monitor-id>",
            "    muteall                        mute all monitors",
            "    remove <monitor-id>            delete the monitor with the id <monitor-id>",
            "    unmute <monitor-id>            unmute the monitor with the id <monitor-id>",
            "    unmuteall                      unmute all monitors",
            "    update <monitor-id> <query>    update an existing monitor",
            "",
            "  Options:",
            "    --states <states>              a comma separated list containing any of \"all\", \"alert\", \"warn\", or \"no data\"",
            "    --tags <tags>                  a comma separated list of \"tag:value\"'s",
            "    --scope <scope>                the scope of the monitor to mute (e.g. \"role:db\")",
            "    --end <end>                    POSIX timestamp for when the mute should end",
            "    --name <name>                  the name for the monitor",
            "    --message <message>            the message for the monitor"
        ];
    },
    handleCli: function(subcommand, args, callback){
        var states = [];
        if(args["states"]){
            states = args["states"].split(",");
        }

        var tags = [];
        if(args["tags"]){
            tags = args["tags"].split(",");
        }

        var name = args["name"];
        var message = args["message"];

        if(subcommand === "get"){
            var monitorId = args._[4];
            get(monitorId, states, callback);
        } else if(subcommand === "getall"){
            var options = {};
            if(states.length){
                options.group_states = states;
            }
            if(tags.length){
                options.tags = tags;
            }
            getAll(options, callback);
        } else if(subcommand === "mute"){
            var monitorId = args._[4];
            var options = {};
            if(args["scope"]){
                options.scope = args["scope"];
            }
            if(args["end"]){
                options.end = args["end"];
            }
            mute(monitorId, options, callback);
        } else if(subcommand === "unmute"){
            var monitorId = args._[4];
            var scope = args["scope"];
            unmute(monitorId, scope, callback);
        } else if(subcommand === "unmuteall"){
            unmuteAll(callback);
        } else if(subcommand === "muteall"){
            muteAll(callback);
        } else if(subcommand === "remove"){
            var monitorId = args._[4];
            remove(monitorId, callback);
        } else if(subcommand === "create" && args._.length > 5){
            var type = args._[4];
            var query = args._[5];
            var properties = {};
            if(name){
                properties.name = name;
            }
            if(message){
                properties.message = message;
            }
            create(type, query, properties, callback);
        } else if(subcommand === "update" && args._.length > 5){
            var monitorId = args._[4];
            var query = args._[5];
            var properties = {};
            if(name){
                properties.name = name;
            }
            if(message){
                properties.message = message;
            }
            update(monitorId, query, properties, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi monitor --help` for help", false);
        }
    }
};
