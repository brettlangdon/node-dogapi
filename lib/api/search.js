var client = require("../client");

/*section: search
 *comment: |
 *  search for metrics and hosts from the past 24 hours
 *params:
 *  query: the seach query to perform (e.g. "app1" or "hosts:app1" or "metrics:response")
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var query = "app";
 *  dogapi.search.search(query, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function search(query, callback){
    var params = {
        query: {
            q: query
        }
    };
    client.request("GET", "/search", params, callback);
}

module.exports = {
    search: search,
    getUsage: function(){
        return [
            "  dogapi search <query>"
        ];
    },
    getHelp: function(){
        return [
            "Search:",
            "  Subcommands:",
            "    search <query>    search for hosts and metrics from the last 24 hours"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "search"){
            search(args["<query>"], callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi search --help` for help", false);
        }
    }
};
