var client = require("../client");
var json = require("../json");
var util = require("util");


/*section: screenboard
 *comment: create a new screenboard
 *params:
 *  boardTitle: the name of the screenboard
 *  widgets: an array of widgets, see http://docs.datadoghq.com/api/screenboards/ for more info
 *  options: |
 *    optional, a object which can contain any of the following keys
 *    * description: description of the screenboard
 *    * templateVariables: |
 *      an array of objects with the following keys
 *      * name: the name of the variable
 *      * prefix: optional, the tag prefix for this variable
 *      * default: optional, the default value for this tag
 *    * width: the width of the screenboard in pixels
 *    * height: the height of the screenboard in pixels
 *    * readOnly: the read-only status of the screenboard
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var boardTitle = "my screenboard";
 *  var widgets = [
 *    {
 *      type: "image",
 *      height: 20,
 *      width: 32,
 *      y: 7,
 *      x: 32,
 *      url: "https://path/to/image.jpg"
 *    }
 *  ];
 *  var options = {
 *    templateVariables: [
 *      {
 *        name: "host1",
 *        prefix: "host",
 *        "default": "host:my-host"
 *      }
 *    ],
 *    description: "it is super awesome"
 *  };
 *  dogapi.screenboard.create(
 *    boardTitle, widgets, options,
 *    function(err, res){
 *      console.dir(res);
 *    }
 *  );
 *  ```
 */
function create(boardTitle, widgets, options, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = options;
        options = {};
    }
    if(typeof options !== "object"){
        options = {};
    }

    var params = {
        body: {
            board_title: boardTitle,
            widgets: widgets
        }
    };

    if(options.description){
        params.body.description = options.description;
    }
    if(options.templateVariables){
        params.body.template_variables = options.templateVariables;
    }
    if(options.width){
        params.body.width = options.width;
    }
    if(options.height){
        params.body.height = options.height;
    }
    if(options.readOnly){
        params.body.read_only = options.readOnly;
    }

    client.request("POST", "/screen", params, callback);
}

/*section: screenboard
 *comment: update an existing screenboard
 *params:
 *  boardId: the id of the screenboard to update
 *  boardTitle: the name of the screenboard
 *  widgets: an array of widgets, see http://docs.datadoghq.com/api/screenboards/ for more info
 *  options: |
 *    optional, a object which can contain any of the following keys
 *    * description: description of the screenboard
 *    * templateVariables: |
 *      an array of objects with the following keys
 *      * name: the name of the variable
 *      * prefix: optional, the tag prefix for this variable
 *      * default: optional, the default value for this tag
 *    * width: the width of the screenboard in pixels
 *    * height: the height of the screenboard in pixels
 *    * readOnly: the read-only status of the screenboard
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  var boardTitle = "my screenboard";
 *  var widgets = [
 *    {
 *      type: "image",
 *      height: 20,
 *      width: 32,
 *      y: 7,
 *      x: 32,
 *      url: "https://path/to/image.jpg"
 *    }
 *  ];
 *  var options = {
 *    description: "it is super awesome"
 *  };
 *  dogapi.screenboard.update(
 *    1234, boardTitle, widgets, options,
 *    function(err, res){
 *      console.dir(res);
 *    }
 *  );
 *  ```
 */
function update(boardId, boardTitle, widgets, options, callback) {
  if(arguments.length < 5 && typeof arguments[3] === "function"){
      callback = options;
      options = {};
  }
  if(typeof options !== "object"){
      options = {};
  }

  var params = {
      body: {
          board_title: boardTitle,
          widgets: widgets
      }
  };

  if(options.description){
      params.body.description = options.description;
  }
  if(options.templateVariables){
      params.body.template_variables = options.templateVariables;
  }
  if(options.width){
      params.body.width = options.width;
  }
  if(options.height){
      params.body.height = options.height;
  }
  if(options.readOnly){
      params.body.read_only = options.readOnly;
  }

  client.request("PUT", util.format("/screen/%s", boardId), params, callback);
}

/*section: screenboard
 *comment: delete an existing screenboard
 *params:
 *  boardId: the id of the screenboard to delete
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.screenboard.remove(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function remove(boardId, callback){
    client.request("DELETE", util.format("/screen/%s", boardId), callback);
}

/*section: screenboard
 *comment: get the info of a single existing screenboard
 *params:
 *  boardId: the id of the screenboard to fetch
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.screenboard.get(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function get(boardId, callback){
    client.request("GET", util.format("/screen/%s", boardId), callback);
}

/*section: screenboard
 *comment: get all existing screenboards
 *params:
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.screenboard.getAll(function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function getAll(callback){
    client.request("GET", "/screen", callback);
}

/*section: screenboard
 *comment: share an existing screenboard
 *params:
 *  boardId: the id of the screenboard to share
 *  callback: function(err, res)
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  var options = {
 *    api_key: "api_key",
 *    app_key: "app_key"
 *  };
 *  dogapi.initialize(options);
 *  dogapi.screenboard.share(1234, function(err, res){
 *    console.dir(res);
 *  });
 *  ```
 */
function share(boardId, callback){
    client.request("POST", util.format("/screen/share/%s", boardId), callback);
}


module.exports = {
    create: create,
    remove: remove,
    update: update,
    get: get,
    getAll: getAll,
    share: share,
    getUsage: function(){
        return [
            "  dogapi screenboard create <boardTitle> <widgets> [--description <description>] [--tmpvars <templateVariables>] [--width <width>] [--height <height>]",
            "  dogapi screenboard remove <boardId>",
            "  dogapi screenboard get <boardId>",
            "  dogapi screenboard getall",
            "  dogapi screenboard share <boardId>"
        ];
    },
    getHelp: function(){
        return [
            "Screenboard:",
            "  Subcommands:",
            "    create <boardTitle> <widgets>           create a new screenboard, <widgets> is a json of the graph definition",
            "    update <boardId> <boardTitle> <widgets> update a screenboard",
            "    remove <boardId>                        remove an existing screenboard",
            "    get <boardId>                           get an existing screenboard",
            "    getall                                  get all screenboards",
            "    share <boardId>                         get share info for an existing screenboard",
            "  Options:",
            "    --description <description>             a description of the screenboard's content",
            "    --tmpvars <templateVariables>           json representation of the template variable definition",
            "    --width <width>                         width of the screenboard in pixels",
            "    --height <height>                       height of the screenboard in pixels",
        ];
    },
    handleCli: function(subcommand, args, callback){
        if(subcommand === "get"){
            get(args._[4], callback);
        } else if(subcommand === "getall"){
            getAll(callback);
        } else if(subcommand === "remove"){
            remove(args._[4], callback);
        } else if(subcommand === "share"){
            share(args._[4], callback);
        } else if (subcommand === "update"){
            var boardId = args._[4];
            var boardTitle = args._[5];
            var widgets = json.parse(args._[6]);

            var options = {};
            if(args["description"]) {
                options.description = args["description"];
            }
            if(args["tmpvars"]){
                options.templateVariables = json.parse(args["tmpvars"]);
            }
            if(args["width"]){
                options.width = parseInt(args["width"]);
            }
            if(args["height"]){
                options.height = parseInt(args["height"]);
            }

            update(boardId, boardTitle, widgets, options, callback);
        } else if(subcommand === "create"){
            var boardTitle = args._[4];
            var widgets = json.parse(args._[5]);

            var options = {};
            if(args["description"]) {
                options.description = args["description"];
            }
            if(args["tmpvars"]){
                options.templateVariables = json.parse(args["tmpvars"]);
            }
            if(args["width"]){
                options.width = parseInt(args["width"]);
            }
            if(args["height"]){
                options.height = parseInt(args["height"]);
            }

            create(boardTitle, widgets, options, callback);
        } else {
            callback("unknown subcommand or arguments try `dogapi screenboard --help` for help", false);
        }
    }
};
