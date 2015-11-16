Object.defineProperty(global, "__stack", {
	get: function(){
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack) {
			return stack;
		};
		var err = new Error;
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});
Object.defineProperty(global, "__line", {
	get: function(){
		return __stack[1].getLineNumber();
	}
});
Object.defineProperty(global, "__function", {
	get: function(){
		return __stack[1].getFunctionName();
	}
});

var express = require("express"), fs = require("fs"), Memcached = require("memcached"),
	bodyParser = require("body-parser"), cookieParser = require("cookie-parser");

GLOBAL.memcached = new Memcached("localhost:11211");
GLOBAL.memcachedFileLifeTime = 1;
GLOBAL.sessionLifeTime = 86400000;
GLOBAL.db = require("./db.js");

var Auth = require("./lib/auth.js");

var User = require("./lib/user.js");
var note = require("./lib/note.js");

var app = express();
app.use(cookieParser());
app.use(authentication);
app.use(bodyParser.json({ limit: "250mb" }));
app.use("/public", express.static("public"));
app.use("/views", express.static("views"));
app.get("/", function(request, response){
	fs.readFile(__dirname + "/views/index/index.html", function(error, data){
		response.writeHead(200, { "Content-Type": "text/html" });
		response.end(data);
	});
});
app.get("/user.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid){
		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(new Buffer(JSON.stringify({ userid: request.user.data.userid, name:  request.user.data.name})));
	}else{
		response.writeHead(403, { "Content-Type": "text/plain" });
		response.end("UnknownUser");
	}
});
app.get("/notes.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid){
		db.getData("notes", "userid", request.user.data.userid, function(error, data){
			response.writeHead(200, { "Content-Type": "application/json" });
			response.end(new Buffer(JSON.stringify({ data: data })));
		});
	}else{
		response.writeHead(403, { "Content-Type": "text/plain" });
		response.end("UnknownUser");
	}
});

app.post("/auth.:format(json)", function(request, response){
	new User().checkLogin(request, response, function(error, user){
		if(error){
			response.writeHead(401, { "Content-Type": "text/plain" });
			response.end("WrongData");
		}else{
			memcached.set("tAuth:" + request.body.hash, user, sessionLifeTime / 1000, function(error){
				if(error){
					response.writeHead(403, { "Content-Type": "text/plain" });
					response.end("MemCachedDown");
				}else{
					response.cookie("tAuth", JSON.stringify([{ "hash": request.body.hash }]), { maxAge: sessionLifeTime, path: '/' });
					response.writeHead(200, { "Content-Type": "application/json" });
					response.end(new Buffer(JSON.stringify({ userid: user.userid, name: user.name})));
				}
			});
		}
	});
});
app.post("/note.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid)
		note.setNote(request, response, request.body, function(error){
			if(error){
				response.writeHead(403, { "Content-Type": "text/plain" });
				response.end("SomethingWrong");
			}else{
				response.writeHead(201, { "Content-Type": "application/json" });
				response.end(new Buffer(JSON.stringify({ data: request.body })));
			}
		});
	else{
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized");
	}
});
app.post("/note/tag.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid)
		note.setNoteTage(request, response, request.body, function(error){
			if(error){
				response.writeHead(403, { "Content-Type": "text/plain" });
				response.end("SomethingWrong");
			}else{
				response.writeHead(201, { "Content-Type": "application/json" });
				response.end(new Buffer(JSON.stringify({ data: request.body })));
			}
		});
	else{
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized");
	}
});

app.put("/note.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid)
		note.editNote(request, response, request.body, function(error){
			if(error){
				response.writeHead(403, { "Content-Type": "text/plain" });
				response.end("SomethingWrong");
			}else{
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(new Buffer(JSON.stringify({ data: request.body })));
			}
		});
	else{
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized");
	}
});


app.delete("/note.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid)
		note.deleteNote(request, response, request.body, function(error){
			if(error){
				response.writeHead(403, { "Content-Type": "text/plain" });
				response.end("SomethingWrong");
			}else{
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(new Buffer(JSON.stringify({})));
			}
		});
	else{
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized");
	}
});
app.delete("/note/tag.:format(json)", function(request, response){
	if(request.user.data && request.user.data.userid)
		note.delNoteTag(request, response, request.body, function(error){
			if(error){
				response.writeHead(403, { "Content-Type": "text/plain" });
				response.end("SomethingWrong");
			}else{
				response.writeHead(200, { "Content-Type": "application/json" });
				response.end(new Buffer(JSON.stringify({ data: request.body })));
			}
		});
	else{
		response.writeHead(401, { "Content-Type": "text/plain" });
		response.end("Unauthorized");
	}
});
app.delete("/auth.:format(json)", function(request, response){
	request.user.logout(request, response, function(){
		response.writeHead(200, { "Content-Type": "application/json" });
		response.end(new Buffer(JSON.stringify({})));
	});
});
app.listen(999);

function authentication(request, response, next){
	request.user = new Auth();
	request.user.checkCookie(request.cookies.tAuth, next, function(){
		next();
	});
}