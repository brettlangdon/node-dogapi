var infrastructure_api = function(){

};

infrastructure_api.prototype.search = function(query, callback){
    this.request('GET', '/search', query, callback);
};

infrastructure_api.prototype.all_tags = function(){

};

infrastructure_api.prototype.host_tags = function(){

};

infrastructure_api.prototype.add_tags = function(){

};

infrastructure_api.prototype.change_tags = function(){

};

infrastructure_api.prototype.detach_tags = function(){

};

return module.exports = infrastructure_api;
