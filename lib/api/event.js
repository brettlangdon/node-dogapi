var client = require("../client");
var util = require("util");

/*section: event
 *comment: |
 *  create a new event
 *params:
 *  title: the title of the event
 *  text: the body of the event
 *  properties: |
 *    an optional object continaing any of the following additional optional properties
 *    * date_happened: POSIX timestamp of when it happened
 *    * priority: "normal" or "low" [defualt: "normal"]
 *    * host: the host name to associate with the event
 *    * tags: array of "tag:value"'s to associate with the event
 *    * alert_type: "error", "warning", "info" or "success" [defualt: "info"]
 *    * aggregation_key: an arbitrary string used to aggregate like events
 *    * source_type_name: options: "nagios", "hudson", "jenkins", "user", "my apps", "feed", "chef", "puppet", "git", "bitbucket", "fabric", "capistrano"
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   var title = "some new event";
 *   var text = "IT HAPPENED!";
 *   dogapi.event.create(title, text, function(err, res){
 *     console.dir(res);
 *   });
 *   title = "another event";
 *   text = "IT HAPPENED AGAIN!";
 *   var properties = {
 *     tags: ["some:tag"],
 *     alert_type: "error"
 *   };
 *   dogapi.event.create(title, text, properties, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function create(title, text, properties, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = properties;
        properties = {};
    }
    if(typeof properties !== "object"){
        properties = {};
    }

    properties.title = title;
    properties.text = text;

    var params = {
        body: properties
    };
    client.request("POST", "/events", params, callback);
}

/*section: event
 *comment: |
 *  get event details from the provided event id
 *params:
 *  eventId: |
 *    the id of the event to fetch
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.event.get(10005, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function get(eventId, callback){
    client.request("GET", util.format("/events/%s", eventId), callback);
}

/*section: event
 *comment: |
 *  query the event stream
 *params:
 *  start: POSIX timestamp for start of query
 *  end: POSIX timestamp for end of query
 *  parameters: |
 *    optional parameters to use for the query
 *    * priority: "low" or "normal"
 *    * sources: comma separated list of sources (e.g. "jenkins,user")
 *    * tags: comma separated list of tags (e.g. "tag:value1,tag:value2")
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   var now = parseInt(new Date().getTime() / 1000);
 *   var then = now - 3600; // an hour ago
 *   var parameters = {
 *     tags: "some:tag",
 *     sources: "jenkins"
 *   };
 *   dogapi.event.query(then, now, parameters, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function query(start, end, parameters, callback){
    if(arguments.length < 4 && typeof argument[2] === "function"){
        callback = parameters;
        parameters = {};
    }

    if(typeof parameters !== "object"){
        parameters = {}
    }
    parameters.start = start;
    parameters.end = end;

    var params = {
        query: parameters
    };

    client.request("GET", "/events", params, callback);
}

module.exports = {
    create: create,
    get: get,
    query: query,
    getUsage: function(){
        return [
            "  dogapi event get <event-id>",
            "  dogapi event query <from> <to> [--priority <priority>] [--sources <sources>] [--tags <tags>]",
            "  dogapi event create <title> <text> [--time <timestamp>] [--priority <priority>] [--host <host>] [--tags <tags>] [--type <type>] [--agg-key <agg-key>] [--source <source>]"
        ];
    },
    getHelp: function(){
        return [
            "Event:",
            "  Subcommands:",
            "    get <event-id>           get the event with the provided <event-id>",
            "    query <from> <to>        query the event stream between <from> and <to> POSIX timestamps",
            "    create <title> <text>    create a new event with <title> and <text>",
            "  Options:",
            "    --priority <priority>    the priority of the event \"normal\" or \"low\"",
            "    --sources <sources>      a comma separated list of sources (e.g. \"users,jenkins,chef\")",
            "    --tags <tags>            a comma separated list of \"tag:value\"'s",
            "    --time <time>            a POSIX timestamp for when the event happened",
            "    --host <host>            the host to associate the event to",
            "    --type <type>            the event type \"error\", \"warning\", \"info\" or \"success\"",
            "    --agg-key <agg-key>      an aggregation key to use to associate like events",
            "    --source <source>        the source to associate with this event (e.g. \"users\", \"jenkins\", etc)"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "get" && args._.length > 4){
            get(parseInt(args._[4]), callback);
        } else if(subcommand === "query" && args._.length > 5){
            var from = parseInt(args._[4]);
            var to = parseInt(args._[5]);
            var parameters = {};
            if(args["sources"]){
                parameters.sources = args["sources"];
            }
            if(args["tags"]){
                parameters.tags = args["tags"];
            }
            query(from, to, parameters, callback);
        } else if(subcommand === "create" && args._.length > 5){
            var title = args._[4];
            var text = args._[5];
            var properties = {};
            if(args["priority"]){
                properties.priority = args["priority"];
            }
            if(args["host"]){
                properties.host = args["host"];
            }
            if(args["time"]){
                properties.date_happened = parseInt(args["time"]);
            }
            if(args["tags"]){
                properties.tags = args["tags"].split(",");
            }
            if(args["agg-key"]){
                properties.aggregation_key = args["agg-key"];
            }
            if(args["source"]){
                properties.source_type_name = args["source"];
            }
            create(title, text, properties, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi event --help` for help", false);
        }
    }
};
