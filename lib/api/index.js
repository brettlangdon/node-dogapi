var api = {
    tag: require("./tag"),
    metric: require("./metric"),
    event: require("./event")
};

module.exports = function(obj){
    for(key in api){
        obj[key] = api[key];
    }
};
