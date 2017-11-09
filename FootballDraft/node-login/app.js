
/**
	* Node.js Login Boilerplate
	* More Info : http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/
	* Copyright (c) 2013-2016 Stephen Braitsch
**/


var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

// var http = require('http');
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url //

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';
// var dbUserRoster = process.env.DB_NAME || 'user_roster'; **not sure why i have this


var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
//var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName+dbUserRoster; **not sure why i have this
if (app.get('env') == 'live'){
// prepend url with authentication credentials // 
	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
//	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName+dbUserRoster; **not sure why i have this
}

app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: dbURL })
	})
);

require('./app/server/routes')(app);

http.listen(app.get('port'), function(){
// http.Server(app).listen(app.get('port'), function(){
	// console.log('Express server listening on port ' + app.get('port'));
});
	console.log('Express server listening on port ' + app.get('port'));


io.sockets.on('connection', function(socket) {
	console.log('A new client connection');
	
	socket.on('sendmsg',function(data){
		// socket.broadcast.emit('updatePrice',data);
		io.emit('updatePrice',data);
	});
	socket.on('sendUser',function(dataUser){
		// socket.broadcast.emit('updatePrice',data);
		io.emit('updateUser',dataUser);
	});
	socket.on('sendTime',function(dataTime){
		// socket.broadcast.emit('updateTime',data);
		io.emit('updateTime',dataTime);
	});
	socket.on('sendPlayer',function(dataPlayer){
		io.emit('updatePlayer',dataPlayer);
	});
});

// io.sockets.on('connection', function(socket) {
// 	// console.log('A new client connection');
	
// 	socket.on('sendTime',function(dataTime){
// 		// socket.broadcast.emit('updateTime',data);
// 		io.emit('updateTime',dataTime);
// 	});
// });
