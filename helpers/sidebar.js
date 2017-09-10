var stats = require('./stats');
var Images = require('./images');
var Comments = require('./comments');

module.exports = function(viewModel, callback) {
	viewModel.sidebar = {
			stats : stats(),
			popular : Images.popular(),
			comments : Comments.newest()		
	};
	
	callback(viewModel);
};