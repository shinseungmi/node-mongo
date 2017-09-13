var mongoose = require('mongoose');
var schema = mongoose.Schema;
var objectId = schema.ObjectId;

var CommentSchema = new schema({
	image_id: {type : objectId},
	email : {type : String },
	name : {type : String},
	gravatar : {type : String},
	comment : {type : String},
	timestamp : {type : Date, 'default':Date.now()}
});

CommentSchema.virtual('image').set(function(image) {
	this._image = image;
}).get(function() {
	return this._image;
});

module.exports = mongoose.model('Comment', CommentSchema);