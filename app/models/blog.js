var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({

	blog : {
		ownerID : Number,
		title : String,
		description: String,
	},
	entries : {
		blogID : Number,
		title : String,
		description : String, 
		dateCreated : Date,
	},

	
});