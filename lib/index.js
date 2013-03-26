var extend = require('extend');

var BaseClient = require('./BaseClient.js');
var AlertApi = require('./AlertApi.js');
var DashApi = require('./DashApi.js');
var EventApi = require('./EventApi.js');
var InfrastructureApi = require('./InfrastructureApi.js');
var MetricApi = require('./MetricApi.js');

var DogHttpApi = function(options){
    BaseClient.call(this, options);
};

extend(DogHttpApi.prototype,
       BaseClient.prototype,
       AlertApi.prototype,
       DashApi.prototype,
       EventApi.prototype,
       InfrastructureApi.prototype,
       MetricApi.prototype);

return module.exports = DogHttpApi;
