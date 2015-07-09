var post = require('../app/models/post');

/*exports.getBlogEntriesList = function() {
	blog.find(function(err, entries) {
		if (err)
			return console.error(err);
		console.dir(entries);
	});
};*/

exports.newPost = function(req, res) {

	// TODO: This does not render the custom flash messages as it should...

	if (req.body.title.length < 1) {
		res.render('createPost', {
			message : req.flash('createPostMessage', "There is no title. This post would be as good as invincible without it!")
		});
		return console.error('There is no title!');
	}

	if (req.body.content.length < 1) {
		res.render('createPost', {
			message : req.flash('createPostMessage', "You seem to lack some content. What would your readers read?")
		});
		return console.error('There are no content!');
	}

	new post({
		userId : req.user.id,
		title : req.body.title,
		content : req.body.content,
		created : new Date().toISOString()
	}).save(function (err) {
		if (err) {
			res.render('createPost', {
				message : req.flash('createPostMessage', "Something went wrong, but it's nothing to do with your input.")
			});
			return console.error(err);
		} 

		res.render('index', {
			title : 'Index'
		});

	});
}