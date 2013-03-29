var search_api = function(){};
search_api.prototype.search = function(query, callback){
    /*
     * search_api.search(query, [callback])
     *
     * method used to query the api for `metrics` or `hosts`
     *
     * `query` the query to use to search the datadog service
     *
     * `callback` an optional function called with the results of the search
     *     callback(error, result, status_code)
    */
    this.request('GET', '/search', {query: {'q': query}}, callback);
};

return module.exports = search_api;
