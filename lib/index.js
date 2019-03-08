const _ = require('lodash/fp');
const api = require('./api');
const Client = require('./client');

const forEach = _.forEach.convert({cap: false});

const initialClient = new Client({});
/* section: dogapi
 *comment: configure the dogapi client with your app/api keys
 *params:
 *  options:
 *   |
 *    An object which allows you to override the default set parameters for interacting
 *    with the datadog api. The available options are.
 *    * api_key: your api key
 *    * app_key: your app key
 *    * api_version: the version of the api [default: `v1`]
 *    * api_host: the host to call [default: `api.datadoghq.com`]
 *    * proxy_agent: Optional, A Https Proxy agent.
 *example:
 *  |
 *    ```javascript
 *    var dogapi = require("dogapi");
 *
 *    // Optional for Proxy -------8<----------
 *    // Code from http://blog.vanamco.com/proxy-requests-in-node-js/
 *    var HttpsProxyAgent = require("./httpsproxyagent");
 *
 *    var agent = new HttpsProxyAgent({
 *        proxyHost: "MY_PROXY_HOST",
 *        proxyPort: 3128
 *    });
 *    // Optional for Proxy -------->8----------
 *
 *    var options = {
 *      api_key: "<API_KEY_HERE>",
 *      app_key: "<APP_KEY_HERE>",
 *      proxy_agent: agent  // Optional for Proxy
 *    };
 *    dogapi.initialize(options);
 *    dogapi.event.create(...);
 *    ```
 */
function initialize(options) {
  options = options || {};
  for (const key in options) {
    if (initialClient.hasOwnProperty(key)) {
      initialClient[key] = options[key];
    }
  }
}

function DogApi(options) {
  const client = new Client(options || {});
  forEach((value, key) => {
    this[key] = value(client);
  }, api);
}

DogApi.initialize = initialize;
forEach((value, key) => {
  DogApi[key] = value(initialClient);
}, api);

/* section: dogapi
 *comment: get the current POSIX timestamp
 *example: |
 *  ```javascript
 *  var dogapi = require("dogapi");
 *  dogapi.now();
 *  // this is the same as
 *  parseInt(new Date().getTime() / 1000);
 *  ```
 */
function now() {
  return parseInt(new Date().getTime() / 1000);
}
module.exports = DogApi;
module.exports.now = now;
module.exports.OK = 0;
module.exports.WARNING = 1;
module.exports.CRITICAL = 2;
module.exports.UNKNOWN = 3;
