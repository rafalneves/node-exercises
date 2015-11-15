//Simulating Async DB

var data = {
	users: [
		{
			userid: 1,
			name: "Rafael",
			username: "rafaneves3@msn.com",
			password: "827ccb0eea8a706c4c34a16891f84e7b"
		},
		{
			userid: 2,
			name: "Adam",
			username: "adam@msn.com",
			password: "827ccb0eea8a706c4c34a16891f84e7b"
		}
	]
};

exports.getData = function(className, key, value, callback){
	if(data[className])
		if(!key)
			callback(null, data[className]);
		else{
			for(var i = 0; i < data[className].length; i++)
				if(data[className][i][key] == value)
					results.push(data[className][i])
			callback(null, results);
		}
	else
		callback("No class with that name.")
}
exports.setData = function(className, data, callback){
	if(data[className]){
		data[className].push(data);

		callback(null);
	}else
		callback("No class with that name.")
}
exports.upData = function(className, key, value, data, callback){
	if(data[className]){
		var upd = false;
		for(var i = 0; i < data[className].length; i++)
			if(data[className][i][key] == data[key]){
				data[className][i] = data;

				upd = true;
				callback(null);

				break;
			}
		if(!upd)
			callback("Unable to find record.");
	}else
		callback("No class with that name.")
}
exports.delData = function(className, key, value, callback){
	if(data[className]){
		var upd = false;
		for(var i = 0; i < data[className].length; i++)
			if(data[className][i][key] == value){
				data[className].splice(i, -1);

				upd = true;
				callback(null);

				break;
			}
		if(!upd)
			callback("Unable to find record.");
	}else
		callback("Unable to find record.");
}