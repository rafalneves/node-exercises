var Auth = function (){}
Auth.prototype.checkCookie = function(authCookie, next, callback){
	if(authCookie){
		var authData = JSON.parse(authCookie);
		this.hash = authData[0]['hash'];
		checkCookieHashAndGetUser(this, function(data, auth){
			if(data){
				auth.data = data;

				callback();
			}else
				callback();
		});
	}else
		callback();
}
function checkCookieHashAndGetUser(auth, callback){
	memcached.get("tAuth:" + auth.hash, function(error, data){
		if(data)
			callback(data, auth);
		else
			callback(false, auth);
	});
}
Auth.prototype.logout = function(request, response, callback){
	memcached.del("tAuth:" + this.hash, function(error){
		callback();
	});
}
module.exports = Auth;