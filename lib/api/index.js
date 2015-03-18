var api = {
    tag: require("./tag")
};

module.exports = function(obj){
    for(key in api){
        obj[key] = api[key];
    }
};
