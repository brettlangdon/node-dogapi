var client = require("../client");

/*section: host
 *comment: mute the given host, if it is not already muted
 *params:
 *  hostname: the hostname of the host to mute
 *  options: |
 *    optional, an object containing any of the following
 *    * end: POSIX timestamp for when the mute should end
 *    * override: whether or not to override the end for an existing mute
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.host.mute("my.host.name", function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function mute(hostname, options, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = options;
        options = {};
    }
    var params = {
        body: {
            hostname: hostname
        }
    };
    if(typeof options === "object"){
        if(options.end){
            params.body.end = parseInt(options.end);
        }
        if(options.override){
            params.body.override = options.override;
        }
    }
    client.request("POST", "/host", params, callback);
}

/*section: host
 *comment: unmute the given host, if it is not already unmuted
 *params:
 *  hostname: the hostname of the host to unmute
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.host.unmute("my.host.name", function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function unmute(hostname, callback){
    var params = {
        body: {
            hostname: hostname
        }
    };
    client.request("POST", "/host", params, callback);
}

module.exports = {
    mute: mute,
    unmute: unmute,
    getUsage: function(){
        return [
            "  dogapi host mute <host> [--end <end>] [--override]",
            "  dogapi host unmute <host>"
        ];
    },
    getHelp: function(){
        return [
            "Host:",
            "  Subcommands:",
            "    mute <host>      mute the host with the provided hostname",
            "    unmute <host>    unmute the host with the provided hostname",
            "",
            "  Options:",
            "    --end <end>      POSIX timestamp for when the mute should end",
            "    --override       override an existing \"end\" for a mute on a host"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "mute"){
            var hostname = args._[4];
            var options = {};
            if(args["end"]){
                options.end = parseInt(args["end"]);
            }
            if(args["override"]){
                options.override = args["override"];
            }
            mute(hostname, options, callback);
        } else if(subcommand === "unmute"){
            var hostname = args._[4];
            unmute(hostname, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi host --help` for help", false);
        }
    }
};
