
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/*
	ESTABLISH DATABASE CONNECTION
*/

var dbName = process.env.DB_NAME || 'node-login';
var dbUserRoster = process.env.DB_NAME || 'user_roster';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e);
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbName+'"');
				}
			});
		}	else{
			console.log('mongo :: connected to database :: "'+dbName+'"');
		}
	}
});

var db_roster = new MongoDB(dbUserRoster, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db_roster.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db_roster.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e);
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbUserRoster+'"');
				}
			});
		}	else{
			console.log('mongo :: connected to database :: "'+dbUserRoster+'"');
		}
	}
});

var accounts = db.collection('accounts');
var allPlayers = db_roster.collection('players_list');
var allPlayersList = db_roster.collection('all_players');

// var user_var = accounts.findOne(user:user);

// exports.getUserRoster = function(udata, callback) 
// {
// 	allPlayers.find({ user_id : udata }).toArray(
// 		function(e, res) {
// 		if (e) user_id(e)
// 		// console.log(user_id);
// 		else user_id(null, res), function(e, o){ callback(o); }
// 	});
// }

	// accounts.findOne({email:email}, function(e, o){ callback(o); });

// var getUserRoster = db_roster.collection('all_players', function(error, collection) {
// 	collection.find({"user_id":"Alan"}, function(err,docs) {
// 		// console.log("printing docs from Array. Count " + JSON.stringify(docs));
// 	});
// });

// var findByUser = function(user, callback)
// var findByUser = accounts.findOne({user: user});
// console.log(findByUser);
// {
// 	db.accounts.findOne({user: user},
// 		function(e, res) {
// 		if (e) callback(e)
// 		else callback(null, res)
// 		console.log(res);
// 	});
// }

// exports.getUserRoster = function(callback)
// exports.getUserRoster = function(udata, callback)
// {
// 	accounts.findOne({user:udata.user}),
// 	//console.log(udata.user); //Displays User signed in	
// 	// accounts.findOne({user:user}, function(e, document) {
// 	// 	console.log(document.user_id);
// 	// });

// 	allPlayers.aggregate( [
// 		{$unwind: '$qb'},
// 		{$match: {"qb.user_id": udata.user }},
// 		{ $group: {'_id': null, 'roster': {$addToSet: '$qb' }}}

// 		// {$group: {_id: null, }},
// 		// {$unwind: '$rb'},		
// 		// {$match: {"rb.user_id": udata.user }}
// 		]).toArray(
// 		function(e, res) {
// 		if (e) callback(e)
// 		else callback(null, res)
// 		// console.log(res);
// 	});
// }

exports.getUserRoster = function(udata, callback)
{
	// allPlayersList.find().toArray(
	// 	function(e, res) {
	// 	if (e) callback(e)
	// 	else callback(null, res)
	// }),
	accounts.findOne({user:udata.user}),
	allPlayers.aggregate( [
		// {$unwind: '$qb'},
		{$match: {"user_id": udata.user }}
		// { $group: {'_id': null, 'roster': {$addToSet: '$qb' }}}
		]).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
		// console.log(res);
	});
}
exports.getUserMoney = function(udata, callback)
{
	accounts.findOne({user:udata.user}),
	allPlayers.aggregate( [
		{$match: 
			{
				"user_id": udata.user 
			}
		},
		{
			$group: {
				_id: '',
				salary_total: { $sum: "$year_2017" }
			}
		},
		{ $project: 
			{
				_id: 0,
				salary_total: "$year_2017"
			}
		}
		]).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
		// console.log(res);
	});
}

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({_id:getObjectId(newData.id)}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(e) {
				if (e) callback(e);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(e) {
					if (e) callback(e);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.findOnePlayer = function(first_name, last_name, callback) 
{
	allPlayers.findOne({
		first_name : newData.first_name,
		last_name : newData.last_name
	}, function(e,o){
		console.log('find one player');
	})
}

exports.getRoster = function(callback)
{
// 		accounts.findOne({_id:getObjectId(newData.id)}, function(e, o){
// 	if (o) {
// 		console.log(o.user);
// 	// 	// callback(o.user);
// } 
	// allPlayers.findOne({
	// 	first_name : newData.first_name,
	// 	last_name : newData.last_name
	// 	}, function(e, o){
	// 		if(o.user_id == ""){
	// 			console.log("unowned");
	// 			// console.log(newData.player_id);
	// 			// o.user_id == o.user;
	// 			// console.log(o.user_id);
	// 		} else{
	// 			console.log("owned by " + o.user_id);
	// 		}
	// 	});
	// });
	
	
	allPlayersList.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.getQB = function(callback)
{
	allPlayers.find({position : "QB"}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.getRB = function(callback)
{
	allPlayers.find({position : "RB"}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}
exports.getWR = function(callback)
{
	allPlayers.find({position : "WR"}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}
exports.getTE = function(callback)
{
	allPlayers.find({position : "TE"}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}


exports.updateRoster = function(newData, callback)
{
	allPlayers.findOne({
		first_name : newData.first_name,
		last_name : newData.last_name
	}, function(e, o){
		o.user_id 	= newData.user;
		// if (o.user_id == ''){
			allPlayers.save(o, {safe: true}, function(e) {
				if (e) callback(e);
				else callback(null, o);
			});
		// }	
		// else{
		// 	saltAndHash(newData.pass, function(hash){
		// 		o.pass = hash;
		// 		allPlayers.save(o, {safe: true}, function(e) {
		// 			if (e) callback(e);
		// 			else callback(null, o);
		// 		});
		// 	});
		// }
	});
}

// exports.updateRoster = function(newData, callback)
// {
// 	accounts.findOne({_id:getObjectId(newData.id)}, function(e, o){
// 	// if (o) {
// 		// var player = accounts.findOne({_id:getObjectId(newData.id)});
// 		console.log(o.user);
// 	// 	// callback(o.user);
// 	allPlayers.findOne({
// 		first_name : newData.first_name,
// 		last_name : newData.last_name
// 	}, function(e, player){
// 		user : newData.user
// 		// allPlayers.findOne({"_id" : o_id}, function(e, o){
// 			if(player.user_id == ""){
// 			// if(o){
// 				// callback('player taken');
// 				console.log("not owned");
// 				console.log(player._id);
// 				var player_id = player.user_id;
// 				var user_id = o.user;
// 				console.log(user_id);
// 				console.log(player.first_name);
// 				console.log(player.last_name);
// 				// console.log(o.user);
// 				// allPlayers.update (
// 				// 	{ _id : player._id},
// 				// 	{ $set: 
// 				// 		{ player_id : user_id }
// 				// 	}
// 				// )
// 			} else{
// 				console.log("owned by " + player.user_id);
// 			}
			
// 		});
// // } 
// 	});

// }
			// o.user_id 	= newData.user_id;
			// o.player 	= newData.player;
			// o.email 	= newData.email;
			// o.country 	= newData.country;
			// if (newData.pass == ''){
			// 	accounts.save(o, {safe: true}, function(e) {
			// 		if (e) callback(e);
			// 		else callback(null, o);
			// 	});
			// }	else{
			// 	saltAndHash(newData.pass, function(hash){
			// 		o.pass = hash;
			// 		accounts.save(o, {safe: true}, function(e) {
			// 			if (e) callback(e);
			// 			else callback(null, o);
			// 		});
			// 	});
			// }

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
