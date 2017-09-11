var mongoose = reqquire('mongoose');
var schema = mongooe.Schema;
var path = require('path');

var ImageSchema	= new schema({
	title : {type:String},
	desciption : {type : String},
	filename : {type : String},
	views : {type : Number, 'default':0},
	likes : {type : Number, 'default':0},
	timestamp : {type : Date, 'default':Date.now()}
});

ImageSchema.virtual('uniqueId').get(function() {
	return this.filename.replace(path.extname(this.filename),'');
});

module.exports = mongoose.model('Image', ImageSchema);