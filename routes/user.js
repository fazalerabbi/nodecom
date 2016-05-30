var router 			= require('express').Router();
var user   			= require('../models/user');
var cart   			= require('../models/cart');
var async   		= require('async');
var passport 		= require('passport');
var passportConfig 	= require('../config/passport');

router.get('/login', function(req, res, next){
	if(req.user) return res.redirect('/');

	res.render('site/login', {
		login_errors:  req.flash('login-errors'),
		signup_errors: req.flash('signup-errors'),
	});
});

router.post('/login', passport.authenticate('local-login', {
	successRedirect	: '/profile',
	failureRedirect	: '/login',
	failureFlash	: true
}));

router.get('/profile', function(req, res, next){
	user.findOne({_id: req.user._id}, function(err, user){
		if(err) return next(err);
		res.render('site/profile', {user: user });
	});
});

router.post('/signup', function(req, res, next){

	async.waterfall([
		function(callback){
			if(req.body.name == "" || req.body.password == "" || req.body.email == "") {
				req.flash('signup-errors', " All fields are required.");
				return res.redirect('/login');
			}
			var userObj 			= new user();
			userObj.profile.name	= req.body.name;
			userObj.password 		= req.body.password;
			userObj.email 			= req.body.email;
			userObj.profile.picture = userObj.gravatar();

			user.findOne({email: req.body.email}, function(err, existingUser){

				if(existingUser) {
					req.flash('signup-errors', req.body.email + " is already esist.");
					return res.redirect('/login');
				} else {
					userObj.save(function(err, user){
						if(err) return next(err);
						callback(null, user);
						//res.json("New user has been created");

					});
				}
			});
		},
		function(user){

			var cartObj = new cart();
			cartObj.owner = user._id;
			cartObj.save(function(err){
				if(err) return next(err);
				//login the user on signup, instead of redirect to login page to login
				req.logIn(user, function(err) {
					if(err) return next(err);
					res.redirect('/profile');
				});
			});
		}
	]);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;