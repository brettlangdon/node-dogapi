var client = require("../client");
var embed = require("./embed");

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

module.exports = {
    snapshot: snapshot,
    createEmbed: embed.create,
    getUsage: function(){
        return [
            "  dogapi graph snapshot <query> <from> <to> [--events <event-query>]"
        ];
    },
    getHelp: function(){
        return [
            "Graph:",
            "  Subcommands:",
            "    snapshot <query> <from> <to> --events <event-query>     |     take a snapshot of a graph",
            "  Options:",
            "    --events <event-query>          a query for event bands to add to the snapshot"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if (args._.length > 5 && subcommand === "snapshot"){
            var query = args._[4];
            var from = parseInt(args._[5]);
            var to = parseInt(args._[6]);
            var eventQuery = args["events"];
            snapshot(query, from, to, eventQuery, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi graph --help` for help", false);
        }
    }
};
