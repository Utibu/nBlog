module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index', { title : 'Index' });
	});

	var api = require('../api/blog');

	app.get('/createPost', isLoggedIn, function(req, res) {
		var msg = req.flash('createPostMessage');
		res.render('createPost.ejs', {
			user : req.user,
			title : 'Create post',
			message : msg
		})
	})

	app.post('/createPost', api.newPost);

	app.get('/login', function(req, res) {
		var msg = req.flash('loginMessage');
		res.render('login', { message: msg });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/administrate',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		var msg = req.flash('signupMessage');
		res.render('signup.ejs', { message: msg, title: 'Signup' });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/administrate',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/administrate', isLoggedIn, function(req, res) {
		res.render('administrate.ejs', {
			user : req.user,
			title : 'Administrate'
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next()

	res.redirect('/');
}