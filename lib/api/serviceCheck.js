var client = require("../client");

/*section: serviceCheck
 *comment: |
 *  post an update to a service check
 *params:
 *  check: the check name (e.g. "app.ok")
 *  hostName: the name of the host submitting the check
 *  status: one of `dogapi.OK`, `dogapi.WARNING`, `dogapi.CRITICAL` or `dogapi.UNKNOWN`
 *  parameters: |
 *    optional, an object containing any of the following
 *    * timestamp: POSIX timestamp for when the check happened
 *    * message: string message to accompany the check
 *    * tags: an array of "tag:value"'s associated with the check
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   var check = "app.ok";
 *   var hostName = "some.machine";
 *   dogapi.serviceCheck.check(
 *     check, hostName, dogapi.WARNING, function(err, res){
 *       console.dir(res);
 *   });
 *  ```
 */
function check(check, hostName, status, parameters, callback){
    if(arguments.length < 5 && typeof arguments[3] === "function"){
        callback = parameters;
        parameters = {};
    }

    if(typeof parameters !== "object"){
        parameters = {};
    }

    parameters.check = check;
    parameters.host_name = hostName,
    parameters.status = status;

    var params = {
        body: parameters
    };
    client.request("POST", "/check_run", params, callback);
};


module.exports = {
    check: check,
    getUsage: function(){
        return [
            "  dogapi servicecheck check <check> <host> <status> [--time <timestamp>] [--message <message>] [--tags <tags>]"
        ];
    },
    getHelp: function(){
        return [
            "Service Check:",
            "  Subcommands:",
            "    check <check> <host> <status>  add a new service check for <check> and <host> at level <status> (0=OK, 1=WARNING, 2=CRITICAL, 3=UNKNOWN)",
            "",
            "  Options:",
            "    --time <timestamp>             the POSIX timestamp to use for the check",
            "    --message <message>            an optional message to accompany the check",
            "    --tags <tags>                  a comma separated list of \"tag:value\"'s for the check"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(args._.length > 6){
            var parameters = {};
            if(args["time"]){
                parameters.time = parseInt(args["time"]);
            }
            if(args["message"]){
                paramaters.message = args["message"];
            }
            if(args["tags"]){
                parameters.tags = args["tags"].split(",");
            }
            check(args._[4], args._[5], parseInt(args._[6]), parameters, callback);
        } else {
            callback("not enough arguments try `dogapi servicecheck --help` for help", false);
        }
    }
};
