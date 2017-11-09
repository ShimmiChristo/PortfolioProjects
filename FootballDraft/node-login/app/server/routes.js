
var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function(app) {

// main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });			
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o == "chris"){
					req.session.user = o;
					res.redirect('/adminhome');
				}
				if (o != null){
				    req.session.user = o;
					res.redirect('/roster');
				} 
				else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
		// // var chathistory = db.collection('alan_roster');
		//  db.collection('alan_roster').find().toArray(function (err, docs) {
			// console.log("hi")
		// });
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/roster', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
		AM.getUserRoster({
			// id : req.session.user._id,
			user: req.session.user.user
		}, function(e, allPlayers){
			// console.log(allPlayers[0].roster);
				res.render('roster', {
					title : 'User Home Page',
					udata : req.session.user,				
					allPla : allPlayers
				});
			});		
		};
		// AM.getUserMoney({
		// 	// id : req.session.user._id,
		// 	// user: req.session.user.user
		// }, function(e, allPlayers){
		// 	console.log(allPlayers);
		// 		res.render('roster', {
		// 			// title : 'User Home Page',
		// 			// udata : req.session.user,				
		// 			salary_total : allPlayers
		// 		});
		// 	});		
	});

	// app.get('/roster', function(req, res) {
	// 	if (req.session.user == null){
	// // if user is not logged-in redirect back to login page //
	// 		res.redirect('/');
	// 	}	else{
	// 	AM.getUserMoney({
	// 		// id : req.session.user._id,
	// 		user: req.session.user.user
	// 	}, function(e, salary){
	// 		console.log(salary);
	// 			res.render('roster', {
	// 				title : 'User Home Page',
	// 				udata : req.session.user,				
	// 				allPla : salary
	// 			});
	// 		});		
	// 	};
	// });

	// app.post('/roster', function(req, res){
	// 	if (req.session.user == null){
	// 		res.redirect('/');
	// 	}	else{
	// 		AM.updateAccount({
	// 			id		: req.session.user._id,
	// 			name	: req.body['name']
	// 			// email	: req.body['email'],
	// 			// pass	: req.body['pass'],
	// 			// country	: req.body['country']
	// 		}, function(e, o){
	// 			if (e){
	// 				res.status(400).send('error-updating-account');
	// 			}	else{
	// 				req.session.user = o;
	// 		// update the user's login cookies if they exists //
	// 				if (req.cookies.user != undefined && req.cookies.pass != undefined){
	// 					res.cookie('user', o.user, { maxAge: 900000 });
	// 					res.cookie('pass', o.pass, { maxAge: 900000 });	
	// 				}
	// 				res.status(200).send('ok');
	// 			}
	// 		});
	// 	}
	// });

	app.get('/settings', function(req, res) {
		// if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			// res.redirect('/');
		// }	else{
			res.render('settings', {
				title : 'Control Panel',
				udata : req.session.user
			});
		// }
	});

	app.post('/settings', function(req, res){
		// if (req.session.user == null){
			// res.redirect('/');
		// }	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.status(200).send('ok');
				}
			});
		// }
	});


	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	// app.get('/home', function(req, res) {
	// 	if (req.session.user == null){
	// // if user is not logged-in redirect back to login page //
	// 		res.redirect('/');
	// 	}	else{
	// 	AM.getRoster({
	// 		// id : req.session.user._id,
	// 		user: req.session.user.user
	// 	}, function(e, allPlayers){
	// 		// console.log(allPlayers[0].roster);
	// 			res.render('home', {
	// 				title : 'User Home Page',
	// 				udata : req.session.user,				
	// 				allPlayerList : allPlayers
	// 			});
	// 		});		
	// 	};
	// });

	app.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
		AM.getRoster( function(e, allPlayersList){
			res.render('home', 
			{ 
				title : 'All Players',
				qbList : JSON.stringify(allPlayersList[0].qb),
				rbList : JSON.stringify(allPlayersList[1].rb),
				wrList : JSON.stringify(allPlayersList[2].wr),
				teList : JSON.stringify(allPlayersList[3].te),
				udata : req.session.user
			});
		})
		}
	});

	app.post('/home', function(req, res){
		// if (req.session.user == null){
			// res.redirect('/');
		// }	else{
			AM.updateRoster({
				id		: req.session.user._id,
				first_name	: req.body['first_name'],
				last_name	: req.body['last_name'],
				user	: req.body['user']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined ){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}					
					res.status(200).send('ok');
				}
			});
		// }
	});

	app.get('/adminhome', function(req, res) {
		if (req.session.user.user !== "chris"){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
		AM.getRoster( function(e, allPlayersList){
			res.render('adminhome', 
			{ 
				title : 'All Players',
				qbList : JSON.stringify(allPlayersList[0].qb),
				rbList : JSON.stringify(allPlayersList[1].rb),
				wrList : JSON.stringify(allPlayersList[2].wr),
				teList : JSON.stringify(allPlayersList[3].te),
				udata : req.session.user
			});
		})
		}
	});

	app.post('/adminhome', function(req, res){
		// if (req.session.user == null){
			// res.redirect('/');
		// }	else{
			AM.updateRoster({
				id		: req.session.user._id,
				first_name	: req.body['first_name'],
				last_name	: req.body['last_name'],
				user	: req.body['user']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined ){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}					
					res.status(200).send('ok');
				}
			});
		// }
	});
	// app.post('/home', function(req, res){
	// 	//if no user then redirect to '/' page
	// 	if (req.session.user == null){
	// 		res.redirect('/');
	// 	}	else{
	// 		//account manager...import updateRoster 
	// 		AM.updateRoster({
	// 			id		: req.session.user._id,
	// 			first_name	: req.body['first_name'],
	// 			last_name	: req.body['last_name'],
	// 		}, function(e, o){
	// 			if (e){
	// 				res.status(400).send('error-updating-account'); 
	// 			}	else{
	// 				req.session.user = o;
	// 				console.log('hi');
	// 		// update the user's login cookies if they exists //
	// 				if (req.cookies.user != undefined ){
	// 					res.cookie('user', o.user, { maxAge: 900000 });
	// 					res.cookie('pass', o.pass, { maxAge: 900000 });	
	// 				}
	// 				res.status(200).send('ok');
	// 			}
	// 		});
	// 	}
	// });

	app.get('/qb', function(req, res) {
		AM.getQB( function(e, allPlayers){
			res.render('qb', 
			{ 
				title : 'All Players', 
				// players : allPlayers 
				qb : allPlayers 
			});
		})
	});
	app.get('/rb', function(req, res) {
		AM.getRB( function(e, allPlayers){
			res.render('rb', 
			{ 
				title : 'All RBs', 
				// players : allPlayers 
				rb : allPlayers 
			});
		})
	});
	app.get('/wr', function(req, res) {
		AM.getWR( function(e, allPlayers){
			res.render('wr', 
			{ 
				title : 'All WRs', 
				// players : allPlayers 
				wr : allPlayers 
			});
		})
	});
	app.get('/te', function(req, res) {
		AM.getTE( function(e, allPlayers){
			res.render('te', 
			{ 
				title : 'All RBs', 
				// players : allPlayers 
				te : allPlayers 
			});
		})
	});
	app.get('/qb', function(req, res) {
		AM.getRoster( function(e, allPlayersList){
			res.render('qb', 
			{ 
				title : 'All Players',
				qbList : allPlayersList[0].qb,
				udata : req.session.user
			});
		})
	});
	app.get('/rb', function(req, res) {
		AM.getRoster( function(e, allPlayersList){
			res.render('rb', 
			{ 
				title : 'All Players', 
				players : allPlayersList, 
				rb : allPlayersList[1].rb 
			});
		})
	});
	app.get('/wr', function(req, res) {
		AM.getRoster( function(e, allPlayersList){
			res.render('wr', 
			{ 
				title : 'All Players', 
				players : allPlayersList, 
				wr : allPlayersList[2].wr
			});
		})
	});
	app.get('/te', function(req, res) {
		AM.getRoster( function(e, allPlayersList){
			res.render('te', 
			{ 
				title : 'All Players', 
				players : allPlayersList, 
				te : allPlayersList[3].te 
			});
		})
	});
	
	
	// app.post('/delete', function(req, res){
	// 	AM.deleteAccount(req.body.id, function(e, obj){
	// 		if (!e){
	// 			res.clearCookie('user');
	// 			res.clearCookie('pass');
	// 			req.session.destroy(function(e){ res.status(200).send('ok'); });
	// 		}	else{
	// 			res.status(400).send('record not found');
	// 		}
	//     });
	// });
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });


};
