var client = require("../client");


/*section: metric
 *comment: |
 *  submit a new metric
 *params:
 *  metric: the metric name
 *  points: |
 *    single datapoint or array of [timestamp, datapoint], if a single point
 *    is given "now" is used as the timestamp
 *  extra: |
 *    optional, object which can contain the following keys
 *    * host: the host source of the metric
 *    * tags: array of "tag:value"'s to use for the metric
 *    * metric_type: which metric type to use ("gauge" or "counter") [default: gauge]
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.metric.send("my.metric", 1000, function(err, results){
 *    console.dir(results);
 *  });
 *  var now = parseInt(new Date().getTime() / 1000);
 *  dogapi.metric.send("my.metric", [now, 1000], function(err, results){
 *    console.dir(results);
 *  });
 *  ```
 */
function send(metric, points, extra, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = extra;
        extra = {};
    }
    // Try to normalize `points`
    // DEV: We need `points` to be an array of arrays regardless of what they give us
    // Always wrap points in an array, this way we will get:
    //   500 => [500]
    //   [<timestamp>, 500] => [[<timestamp>, 500]]
    points = [points];
    points = points.map(function(point){
        // Make sure each point is an array, if not make array with current timestamp
        //   500 => [<timestamp>, 500]
        //   [<timestamp>, 500] => unchanged
        if(!Array.isArray(point)){
            var now = parseInt(new Date().getTime() / 1000);
            point = [now, point];
        }
        return point;
    });

    extra = extra || {};
    var series = [
        {
            metric: metric,
            points: points,
            host: extra.host,
            tags: extra.tags,
            metric_type: extra.metric_type
        }
    ];

    send_all(series, callback);
}

/*section: metric
 *comment: |
 *  send a list of metrics
 *params:
 *  metrics: |
 *    an array of metrics where each element is an object with the following keys
 *    * metric: the name of the metric
 *    * points: a single datapoint or an array of [timestamp, datapoint] (same as `dogapi.metric.send`)
 *    * tags: an array of "tag:value"'s
 *    * host: the source hostname to use for the metrics
 *    * metric_type: the type of metric to use ("gauge" or "counter") [default: gauge]
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var now = parseInt(new Date().getTime() / 1000);
 *  var metrics = [
 *    {
 *      metric: "my.metric",
 *      points: [now, 1000],
 *      tags: ["tag:value"]
 *    },
 *    {
 *      metric: "another.metric",
 *      points: 1000
 *    }
 *  ];
 *  dogapi.metric.send_all(metrics, function(err, results){
 *    console.dir(results);
 *  });
 *  ```
 */
function send_all(metrics, callback){
    var now = parseInt(new Date().getTime() / 1000);
    for(var i = 0; i < metrics.length; ++i){
        if(!Array.isArray(metrics[i].points)){
            metrics[i].points = [now, metrics[i].points];
        }
    }
    var params = {
        body: {
            series: metrics
        }
    };
    client.request("POST", "/series", params, callback);
}

/*section: metric
 *comment: |
 *  make a metric query
 *params:
 *  from: POSIX timestamp for start of query
 *  to: POSIX timestamp for end of query
 *  query: the string query to perform (e.g. "system.cpu.idle{*}by{host}")
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var now = parseInt(new Date().getTime() / 1000);
 *  var then = now - 3600; // one hour ago
 *  var query = "system.cpu.idle{*}by{host}";
 *  dogapi.metric.query(then, now, query, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function query(from, to, query, callback){
    var params = {
        query: {
            from: from,
            to: to,
            query: query
        }
    };
    client.request("GET", "/query", params, callback);
}

module.exports = {
    send: send,
    send_all: send_all,
    query: query,
    getUsage: function(){
        return [
            "  dogapi metric send <metric> <point> [--tags <tags>] [--host <host>] [--type <type>]",
            "  dogapi metric query <from> <to> <query>"
        ]
    },
    getHelp: function(){
        return [
            "Metric:",
            "  Subcommands:",
            "    send <metric> <point>        add a new datapoint for <metric> for right now",
            "    query <from> <to> <query>    query for <query> between <from> and <to> POSIX timestamps",
            "",
            "  Options:",
            "    --tags <tags>                a comma separated list of \"tag:value\"'s",
            "    --host <host>                the hostname that should be associated with this metric",
            "    --type <type>                the type of metric \"gauge\" or \"counter\""
        ]
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "send"){
            var extra = {};
            if(args["--tags"]){
                extra.tags = args["--tags"].split(",");
            }
            if(args["--host"]){
                extra.host = args["--host"];
            }
            if(args["--type"]){
                extra.metric_type = args["--type"];
            }
            send(args["<metric>"], args["<point>"], extra, callback);
        } else if(subcommand === "query" && args._.length > 6){
            var from = parseInt(args._[4]);
            var to = parseInt(args._[5]);
            var q = args._[6];
            query(from, to, q, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi metric --help` for help", false);
        }
    }
};
