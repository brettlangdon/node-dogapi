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

## API

`dogapi` implements all available functions in the official datadog api, http://docs.datadoghq.com/api/.

* `dogapi.stream(start, end, [[filter], callback])`
  * function used to retrieve all events that have occured between
* `dogapi.get_event(event_id, callback)`
  * method used to retrieve a single event's data
* `dogapi.add_event(event, callback)`
  * method used to add a new event to datadog
* `dogapi.add_comment(comment, [callback])`
  * method used to add a new comment to datadog
* `dogapi.update_comment(comment_id, comment, callback)`
  * method used to update a comment that already exists in datadog
* `dogapi.delete_comment(comment_id, callback)`
  * method used to remove a comment from datadog
* `dogapi.add_alert(alert, [callback])`
  * add a new alert to datadog
* `dogapi.update_alert(alert_id, alert, [callback])`
  * update an existing alert
* `dogapi.get_alert(alert_id, [callback])`
  * get the details of an alert from the given id
* `dogapi.delete_alert(alert_id, [callback])`
  * delete the given alert from datadog
* `dogapi.get_all_alerts([callback])`
  * get the details of all alerts in datadog
* `dogapi.mute_alerts([callback])`
  * mute all alerts
* `dogapi.unmute_alerts([callback])`
  * unmute all alerts
* `dogapi.get_dashboard(dash_id, [callback])`
  * method to get a single dashboard information
* `dogapi.get_all_dashboards([callback])`
  * method to retrieve all dashboards in datadog
* `dogapi.create_dashboard(dashboard, [callback])`
  * method used to create a new dashboard in datadog
* `dogapi.update_dashboard(dash_id, dashboard, [callback])`
  * method used to update the dashboard with the provided `dash_id`
* `dogapi.delete_dashboard(dash_id, [callback])`
  * method to remove a dashboard from datadog


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
