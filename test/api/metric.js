var assert = require("assert");
var client = require("../../lib/client");
var extend = require("extend");
var metric = require("../../lib/api/metric");
var sinon = require("sinon");

describe("api/metrics", function(){
    var stub_request;
    beforeEach(function(){
        // Setup `client.request` as a stub
        stub_request = sinon.stub(client, "request");
    });
    afterEach(function(){
        // Reset the original `client.request`
        stub_request.restore();
        stub_request = null;
    });
    describe("#send", function(){
        it("should make a valid api call", function(){
            // Make our api call
            var now = parseInt(new Date().getTime() / 1000);
            metric.send("metric.send", [now, 500]);

            // Assert we properly called `client.request`
            assert(stub_request.calledOnce);
            var call_args = stub_request.getCall(0).args;
            // Method and endpoint are correct
            assert.equal(call_args[0], "POST");
            assert.equal(call_args[1], "/series");

            // Properly formatted body
            // { body: series: [ {metric: "metric.send", host: undefined, tags: undefined, metric_type: undefined} ] }
            // DEV: host/tags/metric_type are optional and should be undefined for this case
            var data = call_args[2];
            assert(data.hasOwnProperty("body"));
            assert(data.body.hasOwnProperty("series"));

            // Assert we have only 1 series
            // series = [ {metric: "", ...}, ... ]
            var series = data.body.series;
            assert(Array.isArray(series));
            assert.equal(series.length, 1);

            // Assert the first series is properly formatted
            // first_series = {metric: "", points: [], ...}
            var first_series = series[0]
            assert.equal(first_series.metric, "metric.send");
            assert(Array.isArray(first_series.points));
            assert.deepEqual(first_series.points, [[now, 500]]);

            // These keys are optional and should be set, but undefined
            assert(first_series.hasOwnProperty("host"));
            assert.equal(first_series.host, undefined);
            assert(first_series.hasOwnProperty("tags"));
            assert.equal(first_series.tags, undefined);
            assert(first_series.hasOwnProperty("metric_type"));
            assert.equal(first_series.metric_type, undefined);
        });

        it("should properly normalize values to points", function(){
            // Make our api call
            metric.send("metrics.send.normalize", 500);

            // Assert we called `client.request` with the correct `points`
            assert(stub_request.calledOnce);
            var call_args = stub_request.getCall(0).args;
            // { body: series: [ {points: [], }, ] }
            var body = call_args[2].body;
            assert.equal(body.series.length, 1);

            // points = [ [<timestamp>, 500] ]
            var points = body.series[0].points;
            assert(Array.isArray(points));
            assert.equal(points.length, 1);

            // point = [<timestamp>, 500]
            var point = points[0];
            assert(Array.isArray(point));
            assert.equal(point.length, 2);
            assert.equal(point[1], 500);
        });
    });
});
