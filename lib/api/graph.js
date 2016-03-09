var client = require("../client");
var extend = require("extend");
var json = require("../json");
var querystring = require("querystring");

/*section: graph
 *comment: take a snapshot of a metric query
 *params:
 *  query: the metric query to use for the snapshot
 *  from: POSIX timestamp for the beginning of the query
 *  to: POSIX timestamp for the end of the query
 *  eventQuery: optional, an event query to overlay event bands on the snapshot
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var query = "system.cpu.idle{*}";
 *  var to = dogapi.now();
 *  var from = to - 3600;  // an hour ago
 *  dogapi.graph.snapshot(query, from, to, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function snapshot(query, from, to, eventQuery, callback){
    if(arguments.length < 5 && typeof arguments[3] === "function"){
        callback = eventQuery;
        eventQuery = undefined;
    }
    var params = {
        query: {
            metric_query: query,
            start: parseInt(from),
            end: parseInt(to)
        }
    };
    if(eventQuery){
        params.query.event_query = eventQuery;
    }

    client.request("GET", "/graph/snapshot", params, callback);
}

/*section: graph
 *comment: create an embed graph of a metric query
 *params:
 *  graph_json: The request array to pass create in the embed
 *  options: optional, object of extra parameters to pass to the embed create (see options[*] params)
 *  options["timeframe"]: optional, one of ("1_hour", "4_hours", "1_day", "2_days", and "1_week")
 *  options["size"]: optional, one of ("small", "medium", "large", "xlarge")
 *  options["legend"]: optional, "yes" or "no"
 *  options["title"]: optional, the title of the embed
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var query = "system.cpu.idle{*}";
 *  var graphJSON = {
 *         viz: "timeseries",
 *         requests: [
 *           {
 *             q: query,
 *             aggregator: "avg",
 *             conditional_formats: [],
 *             type: "area"
 *           }
 *         ]
 *       }
 *  var options = {
 *      timeframe: "1_hour",
 *      size: "xlarge",
 *      legend: "yes",
 *      title: "my awesome embed"
 *  };
 *  dogapi.graph.createEmbed(graphJSON, options, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function createEmbed(graphJSON, options, callback){
    if(callback === undefined && typeof options === 'function'){
        callback = options;
        options = {};
    }
    var body = {
        graph_json: JSON.stringify(graphJSON)
    };
    // Use `extend` to merge `options` into `body`
    // DEV: `extend` will ignore any properties whose value is `undefined`
    extend(body, options || {});

    // Create the request
    var params = {
        body: querystring.stringify(body),
        contentType: "application/x-www-form-urlencoded"
    };

    client.request("POST", "/graph/embed", params, callback);
}

module.exports = {
    snapshot: snapshot,
    createEmbed: createEmbed,
    getUsage: function(){
        return [
            "  dogapi graph snapshot <query> <from> <to> [--events <event-query>]",
            "  dogapi graph create_embed <graph_json> [--timeframe <timeframe>] [--size <size>] [--legend <legend>] [--title <title>]"
        ];
    },
    getHelp: function(){
        return [
            "Graph:",
            "  Subcommands:",
            "    snapshot <query> <from> <to> --events <event-query>     |     take a snapshot of a graph",
            "    create_embed <graph_json> --timeframe <timeframe> --size <size> --legend <legend> --title <title>     |     create a new graph embed",
            "  Options:",
            "    --events <event-query>          a query for event bands to add to the snapshot",
            "    --timeframe  <timeframe>        The timeframe for the embed (1_hour, 4_hours, 1_day, 2_days, and 1_week)",
            "    --size <size>                   The size of the graph to create (small, medium, large, xlarge)",
            "    --legend <legend>               Whether or not to have a legend (yes, no)",
            "    --title <title>                 The title of the embed to create"

        ];
    },
    handleCli: function(subcommand, args, callback){
        if (args._.length > 5 && subcommand === "snapshot"){
            var query = args._[4];
            var from = parseInt(args._[5]);
            var to = parseInt(args._[6]);
            var eventQuery = args["events"];
            snapshot(query, from, to, eventQuery, callback);
        } else if (args._.length > 4 && subcommand === "create_embed") {
            var graph_json = json.parse(args._[4]);
            var options = {
                timeframe: args["timeframe"],
                size: args["size"],
                legend: args["legend"],
                title: args["title"]
            };
            createEmbed(graph_json, options, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi graph --help` for help", false);
        }
    }
};
