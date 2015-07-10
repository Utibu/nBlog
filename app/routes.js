module.exports = function(app, passport) {

	app.use(function (req, res, next) {

		var email = '';

		if (req.user) {
			email = req.user.local.email;
		}

	    res.locals = {
		    email : email,
	   	};
	   	next();
	});
	app.get('/', function(req, res) {
		res.render('index', { title : 'Index' });
	});

	var api = require('../api/blog');

	app.get('/createPost', isLoggedIn, function(req, res) {
		var msg = req.flash('createPostMessage');
		var content = '';

		console.log(req.session.content);

		if (req.session.content) {
			content = req.session.content;
			console.log(content.content);
		} else {
			content = '';
		}

		// TODO: Clear the content session when leaving createPost (maybe)?

		res.render('createPost.ejs', {
			user : req.user,
			title : 'Create post',
			message : msg,
			storedContent : content
		})
	})

	app.get('/blog/:url', function(req, res) {
		api.getEntries(req, res);
	});

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
		res.render('signup.ejs', { 
			message : msg, 
			title : 'Signup',
			url : req.protocol + '://' + req.get('host')
		});
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