var LocalStrategy = require('passport-local').Strategy;

//Load user model
var User = require('../app/models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		console.log('Hej');
		process.nextTick(function() {

			User.findOne({ 'local.email' : email }, function(err, user) {

				if (err)
					return done(err);

				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				} else {
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.blogName = req.body.blogname;
					newUser.local.url = req.body.url;
					// TODO: Set default timezone to GMT+1 (how?)
					newUser.local.created = new Date().toISOString();

					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}

			});
		
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		console.log('I am here m8');
		User.findOne({ 'local.email' : email }, function(err, user) {
			console.log('Error here');
			if (err) {
				console.log('error');
				return done(err);

			}

			if (!user) {
				console.log('No user');
				//req.flash('loginMessage', 'No user found.')
				//req.flash('loginMessage', 'Oops! Wrong password.')
				return done(null, false, req.flash('loginMessage', 'No user found.'));
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
			}

			return done(null, user);
		});
	}));
};