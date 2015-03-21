node-dogapi
===========

Datadog API Node.JS Client modeled after `Datadog/dogapi` python client.

Official API Documentation: http://docs.datadoghq.com/api/

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

The keys can be provided either as constructor parameters when creating an instance of `dogapi`
as `api_key` and `app_key` or as the environment variables `DD_API_KEY` and `DD_APP_KEY`.

**Constructor parameters:**
```javascript
var dogapi = require('dogapi');

var options = {
 api_key: 'YOUR_KEY_HERE',
 app_key: 'YOUR_KEY_HERE',
};

var app = new dogapi(options);
```

**Environment Variables:**
```bash
DD_API_KEY=YOUR_KEY_HERE DD_APP_KEY=YOUR_KEY_HERE node app.js
```

## Sample Usage:

**Example:** get all events since this time yesterday:
```javascript
var dogapi = require('dogapi');

var options = {
  api_key: 'YOUR_KEY_HERE',
  app_key: 'YOUR KEY_HERE',
};

var api = new dogapi(options);

var end = parseInt(new Date().getTime() / 1000);
var start = end - 86400;

api.stream(start, end, function(error, result, status_code){
  if(error){
    console.log('Error: ', error);
    console.log('Status Code: ', status_code);
    return;
  }

  result['events'].forEach(function(event){
    console.log(event['id'] + ': ' + event['title']);
  });
});
```


## License

The MIT License (MIT)
Copyright (c) 2013 Brett Langdon <brett@blangdon.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
