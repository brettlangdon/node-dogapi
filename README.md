dogapi
======

[![npm version](https://badge.fury.io/js/dogapi.svg)](https://www.npmjs.com/package/dogapi)
[![Build Status](https://travis-ci.org/brettlangdon/node-dogapi.svg?branch=master)](https://travis-ci.org/brettlangdon/node-dogapi)
[![Dependency Status](https://david-dm.org/brettlangdon/node-dogapi.svg)](https://david-dm.org/brettlangdon/node-dogapi)

Datadog API Node.JS Client.

Official Datadog API Documentation: http://docs.datadoghq.com/api/

dogapi API Docs: http://brettlangdon.github.io/node-dogapi/

## StatsD

`dogapi` does not provide any functionality to talk to a local `dogstatsd` server.
This library is purely an interface to the HTTP api.

If you are looking for a good Datadog StatsD library, I recommend checking out [node-dogstatsd](https://github.com/joybro/node-dogstatsd).

## Installation

**From NPM:**
```bash
[sudo] npm install dogapi
```

**From source:**
```bash
git clone git://github.com/brettlangdon/node-dogapi.git
cd ./node-dogapi
npm install
```

## Configuration

You will need your Datadog api key as well as an application key to use `dogapi`.

Keys can be found at: https://app.datadoghq.com/account/settings#api

```javascript
var dogapi = require("dogapi");

var options = {
 api_key: "YOUR_KEY_HERE",
 app_key: "YOUR_KEY_HERE",
 // if you are on the Datadog EU site, you need to overwrite the default value of api_host key:
 // api_host: "app.datadoghq.eu"
};

dogapi.initialize(options);
```

### HTTPS Proxy

If you are behind a proxy you need to a proxy agent. You can use the https proxy agent from
http://blog.vanamco.com/proxy-requests-in-node-js/ if you like.
To configure dogapi with the agent just add it to the options.

```javascript
var dogapi = require("dogapi");

//Code from http://blog.vanamco.com/proxy-requests-in-node-js/
var HttpsProxyAgent = require("./httpsproxyagent");

var agent = new HttpsProxyAgent({
   proxyHost: "MY_PROXY_HOST",
   proxyPort: 3128
});

var options = {
   api_key: "YOUR_KEY_HERE",
   app_key: "YOUR_KEY_HERE",
   proxy_agent: agent
};

dogapi.initialize(options);
```

## CLI Usage

`dogapi` now ships with a command line interface `dogapi`. To use it you
will need a `.dogapirc` file which meets the standards of
https://github.com/dominictarr/rc

The config file must contain both `api_key` and `app_key` keys (you can find
your datadog api and app keys here
https://app.datadoghq.com/account/settings#api)

Example:

```json
{
  "api_key": "<API_KEY>",
  "app_key": "<APP_KEY>"
}
```

### Usage

Please run `dogapi --help` to see current usage documentation for the tool.

Every api method available in `dogapi` is exposed via the cli tool.

## Major changes from 1.x.x to 2.x.x
We have updated major versions for this library due to a backwards incompatible change to the argument format for `dogapi.metric.send` and `dogapi.metric.send_all`.

### dogapi.metric.send
Previously in `1.x.x`:

```javascript
var now = parseInt(new Date().getTime() / 1000);
dogapi.metric.send("metric.name", 50);
dogapi.metric.send("metric.name", [now, 50]);
```

Now in `2.x.x`:

```javascript
var now = parseInt(new Date().getTime() / 1000);
dogapi.metric.send("metric.name", 50);
dogapi.metric.send("metric.name", [50, 100]);
dogapi.metric.send("metric.name", [[now, 50]]);
```

### dogapi.metric.send_all
Previously in `1.x.x`:

```javascript
var now = parseInt(new Date().getTime() / 1000);
var metrics = [
  {
    metric: "metric.name",
    points: [now, 50]
  },
  {
    metric: "metric.name",
    points: 50
  }
];
dogapi.metric.send_all(metrics);
```

Now in `2.x.x`:

```javascript
var now = parseInt(new Date().getTime() / 1000);
var metrics = [
  {
    metric: "metric.name",
    points: [[now, 50]]
  },
  {
    metric: "metric.name",
    points: [50, 100]
  },
  {
    metric: "metric.name",
    points: 50
  }
];
dogapi.metric.send_all(metrics);
```

## License

The MIT License (MIT)
Copyright (c) 2013 Brett Langdon <me@brett.is>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
