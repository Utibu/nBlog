var post = require('../app/models/post');
var user = require('../app/models/user');

exports.getEntries = function(req, res) {
	console.log('Requested url: ' + req.params.url);
	user.findOne({ 'local.url': req.params.url }).exec(function(err, usr) {
		if (err) throw err;

		if (!usr) {
			res.render('error', { errorMsg : 'There are no blog with the url ' + req.params.url + '!' });
			return console.error('There are no user');
		}
		console.log('Usr: ' + usr);

		  	post.find({ userId: usr.id }).exec(function(err, pst) {
			  if (err) throw err;
			  
			  if (!pst) {
			  	res.render('error', { errorMsg : 'This blog has no entries.' });
				return console.error('There are no entries');
			  }

			  console.log('Posts: ' + pst);
			  var userLoggedIn = 'no';
			  if (req.isAuthenticated()) {
			  	userLoggedIn = req.user._id;
			  	console.log(userLoggedIn);
			  }
			  res.render('blog', { posts : pst, userid : userLoggedIn });
			});
	  	console.log('User: ' + usr._id);
	});
	
}

exports.getEntryByDate = function(req, res) {
	var year = req.year;
	var month = req.month;
	var day = req.day;
	var title = req.title;

	var lookForDate = year + '-' + month + '-' + day;
}

exports.getSingleEntry = function(req, res) {
	user.findOne({ 'local.url': req.params.blogUrl }).exec(function(err, usr) {
		if (err) throw err;

		if (!usr) {
			res.render('error', { errorMsg : 'There are no blog with the url ' + req.params.url + '!' });
			return console.error('There are no user');
		}

		post.findOne({ url: req.params.entryUrl, userId : usr._id }).exec(function(err, pst) {
			console.log('Url: ' + req.params.blogUrl + ' UserId: ' + usr._id);
			if (err) throw err;
			console.log('Posts: ' + pst);
			
			if (!pst) {
				res.render('error', { errorMsg : 'This blog has no entries.' });
				return console.error('There are no entries');
			}

			res.render('single');


		});
	});
}

exports.newPost = function(req, res) {

	req.session.content = { 'content': req.body.content, 'title': req.body.title };

	if (req.body.title.length < 1) {
		req.flash('createPostMessage', "There is no title. This post would be as good as invincible without it!")
		res.redirect('/createPost');
		return console.error('There is no title!');
	}

	if (req.body.content.length < 1) {
		req.flash('createPostMessage', "You seem to lack some content. What would your readers read?")
		res.redirect('/createPost');
		return console.error('There are no content!');
	}

	req.session.content = null;
	var url = req.body.title;
	var newUrl = url.replace(/\s/g, '-').toLowerCase();

	new post({
		userId : req.user.id,
		title : req.body.title,
		content : req.body.content,
		url : newUrl,
		created : new Date().toISOString()
	}).save(function (err) {
		if (err) {
			res.render('createPost', {
				message : req.flash('createPostMessage', "Something went wrong, but it has nothing to do with your input.")
			});
			return console.error(err);
		} 

		res.render('index', {
			title : 'Index'
		});

	});
}