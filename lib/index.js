var extend = require('extend');

var http_client = require('./http_client.js');
var constants = require('./constants.js');
var alert_api = require('./api/alert.js');
var dash_api = require('./api/dash.js');
var screen_api = require('./api/screen.js');
var event_api = require('./api/event.js');
var tag_api = require('./api/tag.js');
var metric_api = require('./api/metric.js');
var search_api = require('./api/search.js');
var service_check_api = require('./api/service_check.js');
var snapshot_api = require('./api/snapshot.js');


var dogapi = function(options){
    http_client.call(this, options);
};

extend(dogapi.prototype,
       http_client.prototype,
       alert_api.prototype,
       dash_api.prototype,
       screen_api.prototype,
       event_api.prototype,
       tag_api.prototype,
       metric_api.prototype,
       search_api.prototype,
       service_check_api.prototype,
       snapshot_api.prototype);

dogapi.constants = constants;

return module.exports = dogapi;
