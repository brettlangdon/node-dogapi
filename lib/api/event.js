var client = require("../client");
var util = require("util");

/*section: event
 *comment: |
 *  create a new event
 *params:
 *  title: the title of the event
 *  text: the body of the event
 *  properties: |
 *    an optional object continaing any of the following additional optional properties
 *    * date_happened: POSIX timestamp of when it happened
 *    * priority: "normal" or "low" [defualt: "normal"]
 *    * host: the host name to associate with the event
 *    * tags: array of "tag:value"'s to associate with the event
 *    * alert_type: "error", "warning", "info" or "success" [defualt: "info"]
 *    * aggregation_key: an arbitrary string used to aggregate like events
 *    * source_type_name: options: "nagios", "hudson", "jenkins", "user", "my apps", "feed", "chef", "puppet", "git", "bitbucket", "fabric", "capistrano"
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   var title = "some new event";
 *   var text = "IT HAPPENED!";
 *   dogapi.event.create(title, text, function(err, res){
 *     console.dir(res);
 *   });
 *   title = "another event";
 *   text = "IT HAPPENED AGAIN!";
 *   var properties = {
 *     tags: ["some:tag"],
 *     alert_type: "error"
 *   };
 *   dogapi.event.create(title, text, properties, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function create(title, text, properties, callback){
    if(arguments.length < 4 && typeof arguments[2] === "function"){
        callback = properties;
        properties = {};
    }
    if(typeof properties !== "object"){
        properties = {};
    }

    properties.title = title;
    properties.text = text;

    var params = {
        body: properties
    };
    client.request("POST", "/events", params, callback);
}

/*section: event
 *comment: |
 *  get event details from the provided event id
 *params:
 *  eventId: |
 *    the id of the event to fetch
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   dogapi.event.get(10005, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function get(eventId, callback){
    client.request("GET", util.format("/events/%s", eventId), callback);
}

/*section: event
 *comment: |
 *  query the event stream
 *params:
 *  start: POSIX timestamp for start of query
 *  end: POSIX timestamp for end of query
 *  parameters: |
 *    optional parameters to use for the query
 *    * priority: "low" or "normal"
 *    * sources: comma separated list of sources (e.g. "jenkins,user")
 *    * tags: comma separated list of tags (e.g. "tag:value1,tag:value2")
 *  callback: |
 *    function(err, res)
 *example: |
 *  ```javascript
 *   var dogapi = require("dogapi");
 *   var options = {
 *     api_key: "api_key",
 *     app_key: "app_key"
 *   };
 *   dogapi.initialize(options);
 *   var now = parseInt(new Date().getTime() / 1000);
 *   var then = now - 3600; // an hour ago
 *   var parameters = {
 *     tags: "some:tag",
 *     sources: "jenkins"
 *   };
 *   dogapi.event.query(then, now, parameters, function(err, res){
 *     console.dir(res);
 *   });
 *  ```
 */
function query(start, end, parameters, callback){
    if(arguments.length < 4 && typeof argument[2] === "function"){
        callback = parameters;
        parameters = {};
    }

    if(typeof parameters !== "object"){
        parameters = {}
    }
    parameters.start = start;
    parameters.end = end;

    var params = {
        query: parameters
    };

    client.request("GET", "/events", params, callback);
}

module.exports = {
    create: create,
    get: get,
    query: query
};
