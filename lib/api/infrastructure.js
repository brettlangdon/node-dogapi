var client = require("../client");

/*section: infrastructure
 *comment: |
 *  search for metrics or hosts
 *params:
 *  query: |
 *    the query to use for search see [datadog docs](http://docs.datadoghq.com/api/#search)
 *    for examples of the query (e.g. "hosts:database", "metrics:system" or "test")
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.infrastructure.search("hosts:database", function(err, res){
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
            "  dogapi infrastructure search <query>"
        ]
    },
    getHelp: function(){
        return [
            "Infrastructure:",
            "  Subcommands:",
            "    search <query>   query for hosts or metrics with <query> (see http://docs.datadoghq.com/api/#search)",
        ];
    },
    handleCli: function(subcommand, args, callback){
        var query = args._[4];
        search(query, callback);
    }
};
