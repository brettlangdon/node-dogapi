var assert = require("assert");
var client = require("../../lib/client");
var extend = require("extend");
var embed = require("../../lib/api/embed");
var sinon = require("sinon");
var querystring = require("querystring");

describe("api/embed", function(){
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
    describe("#create", function(){
        it("should make a valid api call", function(){
            var graphJSON = {
                viz: "timeseries",
                requests: [
                    {
                        q: "system.cpu.idle{*}"
                    }
                ]
            };
            var options = {
                timeframe: "1_hour",
                size: "large",
                legend: "yes",
                title: "test graph embed"
            };

            // Make our api call
            embed.create(graphJSON, options);

            // Assert we properly called `client.request`
            assert(stub_request.calledOnce);
            var call_args = stub_request.getCall(0).args;
            // Method and endpoint are correct
            assert.equal(call_args[0], "POST");
            assert.equal(call_args[1], "/graph/embed");

            // Properly formatted body and content-type
            var params = call_args[2];
            var expectedBody = {
                graph_json: JSON.stringify(graphJSON),
                timeframe: "1_hour",
                size: "large",
                legend: "yes",
                title: "test graph embed"
            };
            assert.deepEqual(querystring.parse(params.body), expectedBody);
            assert(params.contentType, "application/x-form-urlencoded");
        });

        it("should only require graph_json", function(){
            var graphJSON = {
                viz: "timeseries",
                requests: [
                    {
                        q: "system.cpu.idle{*}"
                    }
                ]
            };

            // Make our api call
            embed.create(graphJSON);

            // Assert we properly called `client.request`
            assert(stub_request.calledOnce);
            var call_args = stub_request.getCall(0).args;

            // Properly formatted body
            var params = call_args[2];
            var expectedBody = {
                graph_json: JSON.stringify(graphJSON)
            };
            assert.deepEqual(querystring.parse(params.body), expectedBody);
        });
    });
});
