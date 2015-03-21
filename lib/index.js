require("./api")(module.exports);

/*section: dogapi
 *params:
 *  options:
 *   |
 *    An object which allows you to override the default set parameters for interacting
 *    with the datadog api. The available options are.
 *    * api_key: your api key
 *    * app_key: your app key
 *    * api_version: the version of the api [default: `v1`]
 *    * api_host: the host to call [default: `api.datadoghq.com`]
 *example:
 *  |
 *    ```javascript
 *    var dogapi = require("dogapi");
 *    var options = {
 *      api_key: "<API_KEY_HERE>",
 *      app_key: "<APP_KEY_HERE>"
 *    };
 *    dogapi.initialize(options);
 *    dogapi.event.create(...);
 *    ```
 */
function initialize(options){
    options = options || {};
    for(var key in options){
        if(module.exports.client.hasOwnProperty(key)){
            module.exports.client[key] = options[key];
        }
    }
};

module.exports.client = require("./client"),
module.exports.initialize = initialize;
module.exports.OK = 0;
module.exports.WARNING = 1;
module.exports.CRITICAL = 2;
module.exports.UNKNOWN = 3;
