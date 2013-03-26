var dash_api = function(){

};

dash_api.prototype.get_dashboard = function(dash_id, callback){
    this.request('GET', util.format('/dash/%s', dash_id), callback)
};

dash_api.prototype.get_all_dashboards = function(callback){
    this.request('GET', '/dash', callback)
};

dash_api.prototype.create_dashboard = function(){

};

dash_api.prototype.update_dashboard = function(){

};

dash_api.prototype.delete_dashboard = function(dash_id, callback){
    this.request('DELETE', util.format('/dash/%s', dash_id), callback)
};

return module.exports = dash_api;
