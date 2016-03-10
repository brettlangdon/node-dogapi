var client = require("../client");
var extend = require("extend");
var json = require("../json");
var querystring = require("querystring");

/*section: embed
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
 *  dogapi.embed.create(graphJSON, options, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function create(graphJSON, options, callback){
    if(callback === undefined && typeof options === "function"){
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

/*section: embed
 *comment: delete an embed with a specific id
 *params:
 *  embedId: the id of the embed to delete
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var embedid = "foo";
 *  dogapi.embed.revoke(embedid, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function revoke(embedId, callback){
    client.request("GET", "/graph/embed/" + embedId + "/revoke", callback);
}


/*section: embed
 *comment: get all embeds from datadog
 *params:
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  dogapi.embed.getAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function getAll(callback) {
    client.request("GET", "/graph/embed", callback);
}

/*section: embed
 *comment: get a single embed
 *params:
 *  embedId: the id of the embed to get
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var embedId = "foo";
 *  dogapi.embed.get(embedId, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function get(embedId, callback) {
    client.request("GET", "/graph/embed/" + embedId, callback);
}

module.exports = {
    create: create,
    revoke: revoke,
    getAll: getAll,
    get: get,
    getUsage: function(){
        return [
            "  dogapi embed create <embed_json> [--timeframe <timeframe>] [--size <size>] [--legend <legend>] [--title <title>]",
            "  dogapi embed revoke <embed_id>",
            "  dogapi embed get <embed_id>",
            "  dogapi embed getall"
        ];
    },
    getHelp: function(){
        return [
            "Embed:",
            "  Subcommands:",
            "    create <embed_json> --timeframe <timeframe> --size <size> --legend <legend> --title <title>     |     create a new graph embed",
            "    revoke <embed_id>               revoke/delete an embed",
            "    get <embed_id>                  gets a single embed object",
            "    getall                          gets all embed objects",
            "  Options:",
            "    --events <event-query>          a query for event bands to add to the snapshot",
            "    --timeframe  <timeframe>        The timeframe for the embed (1_hour, 4_hours, 1_day, 2_days, and 1_week)",
            "    --size <size>                   The size of the embed to create (small, medium, large, xlarge)",
            "    --legend <legend>               Whether or not to have a legend (yes, no)",
            "    --title <title>                 The title of the embed to create"

        ];
    },
    handleCli: function(subcommand, args, callback) {
        if (args._.length > 4 && subcommand === "create") {
            var graph_json = json.parse(args._[4]);
            var options = {
                timeframe: args["timeframe"],
                size: args["size"],
                legend: args["legend"],
                title: args["title"]
            };
            create(graph_json, options, callback);
        } else if (args._.length > 4 && subcommand === "revoke") {
            var embedId = args._[4];
            revoke(embedId, callback);
        } else if (args._.length > 4 && subcommand === "get") {
            var embedId = args._[4];
            get(embedId, callback);
        } else if (subcommand === "getall") {
            getAll(callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi embed --help` for help", false);
        }
    }
};
