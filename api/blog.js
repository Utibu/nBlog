var post = require('../app/models/post');

/*exports.getBlogEntriesList = function() {
	blog.find(function(err, entries) {
		if (err)
			return console.error(err);
		console.dir(entries);
	});
};*/

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

	new post({
		userId : req.user.id,
		title : req.body.title,
		content : req.body.content,
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