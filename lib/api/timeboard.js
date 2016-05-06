var client = require("../client");
var json = require("../json");
var util = require("util");

/*section: timeboard
 *comment: add a new timeboard
 *params:
 *  title: the title of the timeboard
 *  description: the description of the timeboard
 *  graphs: |
 *    an array of objects with the following keys
 *    * title: the name of the graph
 *    * definition: an object containing the graph definition, e.g. `{"requests": [{"q": "system.cpu.idle{*} by {host}"}`
 *  templateVariables: |
 *    optional, an array of objects with the following keys
 *    * name: the name of the variable
 *    * prefix: optional, the tag prefix for this variable
 *    * default: optional, the default value for this tag
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var title = "Time Keeps on Slipping";
 *  var description = "Into the Future";
 *  var graphs = [
 *    {
 *      definition: {
 *        events: [],
 *        requests: [
 *          {q: "avg:system.mem.free{*}"}
 *        ],
 *        viz: "timeseries"
 *      },
 *      title: "Average Memory Free"
 *    }
 *  ];
 *  var templateVariables = [
 *    {
 *      name: "host1",
 *      prefix: "host",
 *      "default": "host:my-host"
 *    }
 *  ];
 *  dogapi.timeboard.create(
 *    title, description, graphs, templateVariables,
 *    function(err, res){
 *      console.dir(res);
 *    }
 *  );
 *  ```
 */
function create(title, description, graphs, templateVariables, callback){
    if(arguments.length < 5 && typeof arguments[3] === "function"){
        callback = templateVariables;
        templateVariables = [];
    }

    var params = {
        body: {
            title: title,
            description: description,
            graphs: graphs
        }
    };
    if(Array.isArray(templateVariables) && templateVariables.length){
        params.body.template_variables = templateVariables;
    }

    client.request("POST", "/dash", params, callback);
}

/*section: timeboard
 *comment: update an existing timeboard
 *params:
 *  dashId: the id of the timeboard to update
 *  title: the title of the timeboard
 *  description: the description of the timeboard
 *  graphs: |
 *    an array of objects with the following keys
 *    * title: the name of the graph
 *    * definition: an object containing the graph definition, e.g. `{"requests": [{"q": "system.cpu.idle{*} by {host}"}`
 *  templateVariables: |
 *    optional, an array of objects with the following keys
 *    * name: the name of the variable
 *    * prefix: optional, the tag prefix for this variable
 *    * default: optional, the default value for this tag
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var title = "Time Keeps on Slipping";
 *  var description = "Into the Future";
 *  var graphs = [
 *    {
 *      definition: {
 *        events: [],
 *        requests: [
 *          {q: "avg:system.mem.free{*}"}
 *        ],
 *        viz: "timeseries"
 *      },
 *      title: "Average Memory Free"
 *    }
 *  ];
 *  var templateVariables = [
 *    {
 *      name: "host1",
 *      prefix: "host",
 *      default: "host:my-host"
 *    }
 *  ];
 *  dogapi.timeboard.update(
 *    1234, title, description, graphs, templateVariables,
 *    function(err, res){
 *      console.dir(res);
 *    }
 *  );
 *  ```
 */
function update(dashId, title, description, graphs, templateVariables, callback){
    if(arguments.length < 6 && typeof arguments[4] === "function"){
        callback = templateVariables;
        templateVariables = [];
    }

    var params = {
        body: {
            title: title,
            description: description,
            graphs: graphs
        }
    };
    if(Array.isArray(templateVariables) && templateVariables.length){
        params.body.template_variables = templateVariables;
    }

    client.request("PUT", util.format("/dash/%s", dashId), params, callback);
}

/*section: timeboard
 *comment: remove an existing timeboard
 *params:
 *  dashId: the id of the timeboard to remove
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.timeboard.remove(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function remove(dashId, callback){
    client.request("DELETE", util.format("/dash/%s", dashId), {}, callback);
}

/*section: timeboard
 *comment: get all existing timeboards
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
 *  dogapi.timeboard.getAll(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function getAll(callback){
    client.request("GET", "/dash", {}, callback);
}

/*section: timeboard
 *comment: get an existing timeboard
 *params:
 *  dashId: the id of the timeboard to get
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.timeboard.get(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function get(dashId, callback){
    client.request("GET", util.format("/dash/%s", dashId), {}, callback);
}

module.exports = {
    create: create,
    update: update,
    remove: remove,
    getAll: getAll,
    get: get,
    getUsage: function(){
        return [
            "  dogapi timeboard get <dash-id>",
            "  dogapi timeboard getall",
            "  dogapi timeboard remove <dash-id>",
            "  dogapi timeboard create <title> <description> <graphs> [--tmpvars <templateVariables>]",
            "  dogapi timeboard update <dash-id> <title> <description> <graphs> [--tmpvars <templateVariables>]",
        ];
    },
    getHelp: function(){
        return [
            "Timeboard:",
            "  Subcommands:",
            "    get <dash-id>                                     get an existing timeboard",
            "    getall                                            get all existing timeboards",
            "    remove <dash-id>                                  remove an existing timeboard",
            "    create <title> <description> <graphs>             create a new timeboard, <graphs> is a json of the graphs definition",
            "    update <dash-id> <title> <description> <graphs>   update an existing timeboard, <graphs> is a json of the graphs definition",
            "  Options:",
            "    --tmpvars <templateVariables>                     a json representation of the template variables definition"
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
            var title = args._[4];
            var description = args._[5];
            var graphs = json.parse(args._[6]);
            var templateVariables = [];
            if(args["tmpvars"]){
                templateVariables = json.parse(args["tmpvars"]);
            }

            create(title, description, graphs, templateVariables, callback);
        } else if(subcommand === "update"){
            var dashId = parseInt(args._[4]);
            var title = args._[5];
            var description = args._[6];
            var graphs = json.parse(args._[7]);
            var templateVariables = [];
            if(args["tmpvars"]){
                templateVariables = json.parse(args["tmpvars"]);
            }

            update(dashId, title, description, graphs, templateVariables, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi timeboard --help` for help", false);
        }
    }
};
