var Dogapi = require("../lib");

var options = {
 api_key: "YOUR_KEY_HERE",
 app_key: "YOUR_KEY_HERE",
};

const dogapi = new Dogapi(options);

dogapi.metric.send('test', 1)