module.exports = function(app, passport) {

	app.use(function (req, res, next) {

		var email = '';
		var url = '';

		if (req.user) {
			email = req.user.local.email;
			url = req.user.local.url;
		}

	    res.locals = {
		    email : email,
		    url : url,
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

	/*app.param('year', function(req, res, next, year) {
		req.year = year;
		next();
	});

	app.param('month', function(req, res, next, month) {
		req.month = month;
		next();
	});

	app.param('day', function(req, res, next, day) {
		req.day = day;
		next();
	});

	app.param('title', function(req, res, next, title) {
		req.title = title;
		next();
	});

	app.get('/blog/:year/:month/:year/:title', function(req, res) {
		//Coming soon
	});*/

	app.param('blogUrl' , function(req, res, next, blogUrl) {
		req.blogUrl = blogUrl;
		next();
	});

	app.param('entryUrl' , function(req, res, next, entryUrl) {
		req.entryUrl = entryUrl;
		next();
	});

	app.get('/blog/:blogUrl/:entryUrl', function(req, res) {
		api.getSingleEntry(req, res);
	});

	app.param('entryId', function(req, res, next, entryId) {
		req.entryId = entryId;
		console.log('EntryId: ' + req.entryId);
		next();
	});

	app.param('handle', function(req, res, next, handle) {
		req.handle = handle;
		console.log('Handle: ' + req.handle);
		next();
	});

	app.get('/blog/entry/:entryId/:handle', function(req, res) {
		//console.log(req.entryId + req.handle);
		res.render('index');
	});

	app.get('/blog/entry/:entryId', function(req, res) {
		res.render('single');
	})

	/*app.get('/:url', function(req, res) {
		api.getEntries(req, res);
	});*/

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