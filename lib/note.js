exports.setNote = function(request, response, note, callback){
	db.getData("notes", null, null, function(error, notes){
		if(error) callback(error);
		else{
			request.body.noteid = notes.length ? notes[notes.length - 1].noteid + 1 : 1;
			request.body.datetime = new Date().toUTCString();
			request.body.userid = request.user.data.userid;
			request.body.tags = new Array();
		}

		db.setData("notes", note, function(error){
			callback(error);
		});
	});
}
exports.editNote = function(request, response, note, callback){
	db.getData("notes", "noteid", note.noteid, function(error, notes){
		if(error) callback(error);
		else
			if(notes.length && notes[0].userid == request.user.data.userid)
				db.editData("notes", "noteid", note.noteid, note, function(error){
					callback(error);
				});
			else{
				response.writeHead(401, { "Content-Type": "text/plain" });
				response.end("NotYours");
			}
	});
}
exports.deleteNote = function(request, response, note, callback){
	db.getData("notes", "noteid", note.noteid, function(error, notes){
		if(error) callback(error);
		else
			if(notes.length && notes[0].userid == request.user.data.userid)
				db.delData("notes", "noteid", note.noteid, function(error){
					callback(error);
				});
			else{
				response.writeHead(401, { "Content-Type": "text/plain" });
				response.end("NotYours");
			}
	});
}
exports.setNoteTage = function(request, response, body, callback){
	db.getData("notes", "noteid", body.noteid, function(error, notes){
		if(error) callback(error);
		else
			if(notes.length && notes[0].userid == request.user.data.userid){
				var exists = false;
				for(var i = 0; i < notes[0].tags.length; i++)
					if(notes[0].tags[i].tag == body.tag){
						exists = true;

						break;
					}
				if(!exists)
					notes[0].tags.push({tag: body.tag});
				db.editData("notes", "noteid", body.noteid, notes[0], function(error){
					callback(error);
				});
			}else{
				response.writeHead(401, { "Content-Type": "text/plain" });
				response.end("NotYours");
			}
	});
}
exports.delNoteTag = function(request, response, body, callback){
	db.getData("notes", "noteid", body.noteid, function(error, notes){
		if(error) callback(error);
		else
			if(notes.length && notes[0].userid == request.user.data.userid){
				for(var i = 0; i < notes[0].tags.length; i++)
					if(notes[0].tags[i].tag == body.tag){
						notes[0].tags.splice(i, 1);

						break;
					}

				db.editData("notes", "noteid", body.noteid, notes[0], function(error){
					callback(error);
				});
			}else{
				response.writeHead(401, { "Content-Type": "text/plain" });
				response.end("NotYours");
			}
	});
}