var client = require("../client");
var util = require("util");

/*section: comment
 *comment: create a new comment
 *params:
 *  message: the message of the comment
 *  properties: |
 *    optional, an object containing any of the following
 *    * handle: the handle to associate the comment with (e.g. "user@domain.com")
 *    * related_event_id: the event to associate the comment with
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.comment.create("a comment message", function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function create(message, properties, callback){
    if(arguments.length < 3 && typeof arguments[1] === "function"){
        callback = properties;
        properties = {};
    }

    var params = {
        body: {
            message: message
        }
    };

    if(typeof properties === "object"){
        if(properties.handle){
            params.body.handle = properties.handle;
        }
        if(properties.related_event_id){
            params.body.related_event_id = properties.related_event_id;
        }
    }

    client.request("POST", "/comments", params, callback);
}

/*section: comment
 *comment: update an existing comment
 *params:
 *  commentId: the id of the comment to update
 *  message: the message of the comment
 *  handle: optional, the handle to associate the comment with (e.g. "user@domain.com")
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.comment.update(1234, "new message", function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function update(commentId, message, handle, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = handle;
        handle = undefined;
    }

    var params = {
        body: {
            message: message
        }
    };
    if(handle){
        params.body.handle = properties.handle;
    }

    client.request("PUT", util.format("/comments/%s", commentId), params, callback);
}

/*section: comment
 *comment: remove a comment
 *params:
 *  commentId: the id of the comment to remove
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.comment.remove(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function remove(commentId, callback){
    client.request("DELETE" ,util.format("/comments/%s", commentId), callback);
}


module.exports = {
    create: create,
    update: update,
    remove: remove,
    getUsage: function(){
        return [
            "  dogapi comment create <message> [--handle <handle>] [--event <event-id>]",
            "  dogapi comment update <comment-id> <message> [--handle <handle>]",
            "  dogapi comment remove <comment-id>"
        ];
    },
    getHelp: function(){
        return [
            "Comment:",
            "  Subcommands:",
            "    create <message>                  add a new comment",
            "    update <comment-id> <message>     update an existing comment",
            "    remove <comment-id>               delete a comment",
            "",
            "  Options:",
            "    --handle <handle>                  the handle to associate with the comment (e.g. \"user@domain.com\")",
            "    --event <event-id>                 related event id to associate the comment with"
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "create"){
            var message = args._[4];
            var properties = {};
            if(args["handle"]){
                properties.handle = args["handle"];
            }
            if(args["event"]){
                properties.related_event_id = parseInt(args["event"]);
            }
            create(message, properties, callback);
        } else if(subcommand === "update"){
            var commentId = args._[4];
            var message = args._[5];
            update(commentId, message, args["handle"], callback);
        } else if(subcommand === "remove"){
            var commentId = args._[4];
            remove(commentId, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi comment --help` for help", false);
        }
    }
};
