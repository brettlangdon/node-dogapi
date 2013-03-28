var extend = require('extend');

var http_client = require('./http_client.js');
var alert_api = require('./api/alert.js');
var dash_api = require('./api/dash.js');
var event_api = require('./api/event.js');
var tag_api = require('./api/tag.js');
var metric_api = require('./api/metric.js');
var search_api = require('./api/search.js');

var dogapi = function(options){
    http_client.call(this, options);
};

extend(dogapi.prototype,
       http_client.prototype,
       alert_api.prototype,
       dash_api.prototype,
       event_api.prototype,
       tag_api.prototype,
       metric_api.prototype,
       search_api.prototype);

return module.exports = dogapi;
