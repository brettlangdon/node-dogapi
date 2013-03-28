var search_api = function(){};
search_api.prototype.search = function(query, callback){
    this.request('GET', '/search', {query: {'q': query}}, callback);
};

return module.exports = search_api;
