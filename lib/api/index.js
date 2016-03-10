var api = {
    comment: require("./comment"),
    downtime: require("./downtime"),
    embed: require("./embed"),
    event: require("./event"),
    graph: require("./graph"),
    host: require("./host"),
    infrastructure: require("./infrastructure"),
    metric: require("./metric"),
    monitor: require("./monitor"),
    screenboard: require("./screenboard"),
    search: require("./search"),
    serviceCheck: require("./serviceCheck"),
    tag: require("./tag"),
    timeboard: require("./timeboard"),
    user: require("./user"),
};

module.exports = function(obj){
    for(var key in api){
        obj[key] = api[key];
    }
};
