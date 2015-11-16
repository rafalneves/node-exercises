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
	],
	notes: [
		{
			noteid: 1,
			title: "Note 1",
			body: "Note 1 body",
			datetime: new Date().toUTCString(),
			userid: 1,
			tags: new Array()
		}
	]
};

exports.getData = function(className, key, value, callback){
	if(data[className])
		if(!key)
			callback(null, data[className]);
		else{
			var results = new Array();
			for(var i = 0; i < data[className].length; i++)
				if(data[className][i][key] == value)
					results.push(data[className][i])
			callback(null, results);
		}
	else
		callback("No class with that name.")
}
exports.setData = function(className, reqData, callback){
	if(data[className]){
		data[className].push(reqData);

		callback(null);
	}else
		callback("No class with that name.")
}
exports.editData = function(className, key, value, reqData, callback){
	if(data[className]){
		var upd = false;
		for(var i = 0; i < data[className].length; i++)
			if(data[className][i][key] == reqData[key]){
				data[className][i] = reqData;

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
				data[className].splice(i, 1);

				upd = true;
				callback(null);

				break;
			}
		if(!upd)
			callback("Unable to find record.");
	}else
		callback("Unable to find record.");
}