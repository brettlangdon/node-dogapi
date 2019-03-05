const Embed = require('./embed');

module.exports = function(client) {
  const embed = Embed(client);

  /* section: graph
     *comment: take a snapshot of a metric query
     *params:
     *  query: the metric query to use for the snapshot
     *  from: POSIX timestamp for the beginning of the query
     *  to: POSIX timestamp for the end of the query
     *  eventQuery: optional, an event query to overlay event bands on the snapshot
     *  callback: function(err, res)
     *example: |
     *  ```javascript
     *  const dogapi = require("dogapi");
     *  const options = {
     *    api_key: "api_key",
     *    app_key: "app_key"
     *  };
     *  dogapi.initialize(options);
     *  const query = "system.cpu.idle{*}";
     *  const to = dogapi.now();
     *  const from = to - 3600;  // an hour ago
     *  dogapi.graph.snapshot(query, from, to, function(err, res){
     *    console.dir(res);
     *  });
     *  ```
     */
  function snapshot(query, from, to, eventQuery, callback) {
    if (arguments.length < 5 && typeof arguments[3] === 'function') {
      callback = eventQuery;
      eventQuery = undefined;
    }
    const params = {
      query: {
        metric_query: query,
        start: parseInt(from),
        end: parseInt(to)
      }
    };
    if (eventQuery) {
      params.query.event_query = eventQuery;
    }

    client.request('GET', '/graph/snapshot', params, callback);
  }

  return {
    snapshot,
    createEmbed: embed.create,
    getUsage() {
      return ['  dogapi graph snapshot <query> <from> <to> [--events <event-query>]'];
    },
    getHelp() {
      return [
        'Graph:',
        '  Subcommands:',
        '    snapshot <query> <from> <to> --events <event-query>     |     take a snapshot of a graph',
        '  Options:',
        '    --events <event-query>          a query for event bands to add to the snapshot'
      ];
    },
    handleCli(subcommand, args, callback) {
      if (args._.length > 5 && subcommand === 'snapshot') {
        const query = args._[4];
        const from = parseInt(args._[5]);
        const to = parseInt(args._[6]);
        const eventQuery = args.events;
        snapshot(query, from, to, eventQuery, callback);
      } else {
        return callback(
          'unknown subcommand or arguments try `dogapi graph --help` for help',
          false
        );
      }
    }
  };
};
