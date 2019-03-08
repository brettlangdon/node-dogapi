module.exports = function (client) {
    /*section: search
     *comment: |
     *  search for metrics and hosts from the past 24 hours
     *params:
     *  query: the seach query to perform (e.g. "app1" or "hosts:app1" or "metrics:response")
     *  callback: function(err, res)
     *example: |
     *  ```javascript
     *  const dogapi = require("dogapi");
     *  const options = {
     *    api_key: "api_key",
     *    app_key: "app_key"
     *  };
     *  dogapi.initialize(options);
     *  const query = "app";
     *  dogapi.search.query(query, function(err, res){
     *    console.dir(res);
     *  });
     *  ```
     */
    function query(query, callback) {
        const params = {
            query: {
                q: query
            }
        };
        client.request("GET", "/search", params, callback);
    }

    return {
        query: query,
        getUsage: function () {
            return [
                "  dogapi search query <query>"
            ];
        },
        getHelp: function () {
            return [
                "Search:",
                "  Subcommands:",
                "    query <query>    search for hosts and metrics from the last 24 hours"
            ];
        },
        handleCli: function (subcommand, args, callback) {
            if (subcommand === "query" && args._.length > 4) {
                query(args._[4], callback);
            } else {
                callback("unknown subcommand or arguments try `dogapi search --help` for help", false);
            }
        }
    };
};
