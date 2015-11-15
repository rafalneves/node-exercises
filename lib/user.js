var crypto = require("crypto");

var User = function (){
	this.data = null;
}
User.prototype.checkLogin = function(request, response, callback){
	db.getData("users", null, null, function(error, users){
		if(error)
			callback(error);
		else{
			var ext = false;
			for(var i = 0; i < users.length; i++)
				if(crypto.createHash("md5").update(users[i].username + users[i].password).digest("hex") == request.body.hash){
					callback(null, users[i]);
					ext = true;
					break;
				}
			if(!ext)
				callback("Invalid login attempt.");
		}
	});
}
module.exports = User;