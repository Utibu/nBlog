var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var postSchema = mongoose.Schema({

		userId : {
			type: mongoose.Schema.ObjectId, 
			ref: 'UserSchema'
		},
		title : String,
		content : String,
		url : String,
		created : Date
	
});

module.exports = mongoose.model('Post', postSchema);