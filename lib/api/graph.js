var client = require("../client");
var json = require("../json");

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
 *  timeframe: optional, one of ("1_hour", "4_hours", "1_day", "2_days", and "1_week")
 *  size: optional, one of ("small", "medium", "large", "xlarge")
 *  legend: optional, "yes" or "no"
 *  title: optional, the title of the embed
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
 *  var graph_json = {
 *         "viz": "timeseries",
 *         "requests": [
 *           {
 *             "q": query,
 *             "aggregator": "avg",
 *             "conditional_formats": [],
 *             "type": "area"
 *           }
 *         ]
 *       }
 *  var timeframe = '1_hour';
 *  var size = 'xlarge';
 *  var legend = 'yes';
 *  var title = 'my awesome embed';
 *  dogapi.graph.createEmbed(graph_json, timeframe, size, legend, title, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function createEmbed(graph_json, timeframe, size, legend, title, callback){
    var lastArgument = arguments.length -1;

    var params = {
        body: 'graph_json=' + JSON.stringify(graph_json) +
            '&timeframe=' + timeframe +
            '&size=' + size +
            '&legend=' + legend +
            '&title=' + title
        ,
        contentType: 'application/x-www-form-urlencoded'
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
            var timeframe = args["timeframe"];
            var size = args["size"];
            var legend = args["legend"];
            var title = args["title"];
            createEmbed(graph_json, timeframe, size, legend, title, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi graph --help` for help", false);
        }
    }
};
