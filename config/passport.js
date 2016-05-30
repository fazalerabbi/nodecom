var passport 		= require('passport');
var localStrategy 	= require('passport-local').Strategy;
var user = require('../models/user');

//serialize and deserialize

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	user.findById(id, function(err, user){
		done(err, user);
	});
});
// Milddleware


passport.use('local-login', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
		if( email == "" || password == "" ) {
			console.log('All fields are required.');
			req.flash('login_errors', 'All fields are required.')
			return res.redirect('/login');
//			return done(null, false, req.flash('login_errors', 'All fields are required.'));
		}
		user.findOne({email: email}, function(err, user) {
			if(err) return done(err);

			if(!user) {
				return done(null, false, req.flash('login_errors', 'No user has been found.'));
			}

			if(!user.comparePassword(password)) {
				return done(null, false, req.flash('login_errors', 'Oops! Wrong password.'));	
			}

			return done(null, user);
		});
	}
));

//custom function to validate

exports.isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	return res.redirect('/login');
}