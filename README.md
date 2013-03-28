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
