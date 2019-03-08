module.exports = function(client) {
  /* section: metric
     *comment: |
     *  send a list of metrics
     *params:
     *  metrics: |
     *    an array of metrics where each element is an object with the following keys
     *    * metric: the name of the metric
     *    * points: a single data point (e.g. `50`), an array of data points (e.g. `[50, 100]`) or an array of `[timestamp, value]` elements (e.g. `[[now, 50], [now, 100]]`)
     *    * tags: an array of "tag:value"'s
     *    * host: the source hostname to use for the metrics
     *    * metric_type|type: the type of metric to use ("gauge" or "count") [default: gauge]
     *  callback: |
     *    function(err, res)
     *example: |
     *  ```javascript
     *  const dogapi = require("dogapi");
     *  const options = {
     *    api_key: "api_key",
     *    app_key: "app_key"
     *  };
     *  dogapi.initialize(options);
     *  const now = parseInt(new Date().getTime() / 1000);
     *  const metrics = [
     *    {
     *      metric: "my.metric",
     *      points: [[now, 1000]],
     *      tags: ["tag:value"]
     *    },
     *    {
     *      metric: "another.metric",
     *      points: [50, 1000]
     *    },
     *    {
     *      metric: "another.metric",
     *      points: 1000
     *    }
     *  ];
     *  dogapi.metric.send_all(metrics, function(err, results){
     *    console.dir(results);
     *  });
     *  ```
     */
  function send_all(metrics, callback) {
    const now = parseInt(new Date().getTime() / 1000);
    for (let i = 0; i < metrics.length; ++i) {
      // Try to normalize `points`
      // DEV: We need `points` to be an array of arrays regardless of what they give us
      // Always wrap points in an array, this way we will get:
      //   500 => [500]
      //   [500, 100] => [[<timestamp>, 500], [<timestamp>, 1000]]
      //   [[<timestamp>, 500]] => [[<timestamp>, 500]]
      let points = metrics[i].points;
      if (!Array.isArray(metrics[i].points)) {
        points = [points];
      }
      points = points.map(function(point) {
        // Make sure each point is an array, if not make array with current timestamp
        //   500 => [<timestamp>, 500]
        //   [<timestamp>, 500] => unchanged
        if (!Array.isArray(point)) {
          point = [now, point];
        }
        return point;
      });

      metrics[i].points = points;

      // DEV: Change `metric_type` to `type` for backwards compatibility
      metrics[i].type = metrics[i].type || metrics[i].metric_type;
      // Remove `metric_type` if it was set
      // DEV: This will not cause an error if `metric_type` does not exist
      delete metrics[i].metric_type;
    }

    const params = {
      body: {
        series: metrics
      }
    };
    client.request('POST', '/series', params, callback);
  }

  /* section: metric
     *comment: |
     *  submit a new metric
     *params:
     *  metric: the metric name
     *  points: |
     *    a single data point (e.g. `50`), an array of data points (e.g. `[50, 100]`)
     *    or an array of `[timestamp, value]` elements (e.g. `[[now, 50], [now, 100]]`)
     *  extra: |
     *    optional, object which can contain the following keys
     *    * host: the host source of the metric
     *    * tags: array of "tag:value"'s to use for the metric
     *    * metric_type|type: which metric type to use ("gauge" or "count") [default: gauge]
     *  callback: |
     *    function(err, res)
     *example: |
     *  ```javascript
     *  const dogapi = require("dogapi");
     *  const options = {
     *    api_key: "api_key",
     *    app_key: "app_key"
     *  };
     *  dogapi.initialize(options);
     *  dogapi.metric.send("my.metric", 1000, function(err, results){
     *    console.dir(results);
     *  });
     *  dogapi.metric.send("my.metric", [500, 1000], function(err, results){
     *    console.dir(results);
     *  });
     *  const now = parseInt(new Date().getTime() / 1000);
     *  dogapi.metric.send("my.metric", [[now, 1000]], function(err, results){
     *    console.dir(results);
     *  });
     *  dogapi.metric.send("my.counter", 5, {type: "count"}, function(err, results){
     *    console.dir(results);
     *  });
     *  ```
     */
  function send(metric, points, extra, callback) {
    if (arguments.length < 4 && typeof arguments[2] === 'function') {
      callback = extra;
      extra = {};
    }
    extra = extra || {};
    const series = [
      {
        metric,
        points,
        host: extra.host,
        tags: extra.tags,
        // DEV: For backwards compatibility, allow `metric_type`
        type: extra.type || extra.metric_type
      }
    ];

    send_all(series, callback);
  }

  /* section: metric
     *comment: |
     *  make a metric query
     *params:
     *  from: POSIX timestamp for start of query
     *  to: POSIX timestamp for end of query
     *  q: the string query to perform (e.g. "system.cpu.idle{*}by{host}")
     *  callback: function(err, res)
     *example: |
     *  ```javascript
     *  const dogapi = require("dogapi");
     *  const options = {
     *    api_key: "api_key",
     *    app_key: "app_key"
     *  };
     *  dogapi.initialize(options);
     *  const now = parseInt(new Date().getTime() / 1000);
     *  const then = now - 3600; // one hour ago
     *  const query = "system.cpu.idle{*}by{host}";
     *  dogapi.metric.query(then, now, query, function(err, res){
     *    console.dir(res);
     *  });
     *  ```
     */
  function query(from, to, q, callback) {
    const params = {
      query: {
        from,
        to,
        query: q
      }
    };
    client.request('GET', '/query', params, callback);
  }

  return {
    send,
    send_all,
    query,
    getUsage() {
      return [
        '  dogapi metric send <metric> <point> [--tags <tags>] [--host <host>] [--type <type>]',
        '  dogapi metric query <from> <to> <query>'
      ];
    },
    getHelp() {
      return [
        'Metric:',
        '  Subcommands:',
        '    send <metric> <point>        add a new datapoint for <metric> for right now',
        '    query <from> <to> <query>    query for <query> between <from> and <to> POSIX timestamps',
        '',
        '  Options:',
        '    --tags <tags>                a comma separated list of "tag:value"\'s',
        '    --host <host>                the hostname that should be associated with this metric',
        '    --type <type>                the type of metric "gauge" or "count"'
      ];
    },
    handleCli(subcommand, args, callback) {
      if (args._.length > 5 && subcommand === 'send') {
        const extra = {};
        if (args.tags) {
          extra.tags = args.tags.split(',');
        }
        extra.host = args.host;
        extra.type = args.type;
        send(args._[4], args._[5], extra, callback);
      } else if (subcommand === 'query' && args._.length > 6) {
        const from = parseInt(args._[4]);
        const to = parseInt(args._[5]);
        const q = args._[6];
        query(from, to, q, callback);
      } else {
        return callback(
          'unknown subcommand or arguments try `dogapi metric --help` for help',
          false
        );
      }
    }
  };
};
