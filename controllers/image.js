var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');

module.exports = {
		index : function(req, res) {
			var viewModel = {
					image : {uniqueId : 1,
							 title : 'Sample Image 1',
							 description : 'This is a sample',
							 filename : 'sample1.jpg',
							 views : 0,
							 likes : 0,
							 timestamp : Date.now()
							},
					
					comments : [
						{
							 image_id : 1,						
							 email : 'test@test.com',
							 name : 'Test Tester',
							 gravatar : 'http://lorempixel.com/75/75/animal/1',
							 comment : 'This is a test comment....',
							 timestamp : Date.now()
						}, {
							image_id : 2,
							 email : 'test2222@test.com',
							 name : 'Test2 Tester2',
							 gravatar : 'http://lorempixel.com/75/75/animal/2',
							 comment : 'Another followup test comment....',
							 timestamp : Date.now()
						}
					]
					
			};
			sidebar(viewModel, function(viewModel) {
				res.render('image', viewModel);
			});
			
		},

		create : function(req, res) {
			var saveImage = function() {
				var possible = 'abcdefghijklmnopqrstuwxyz';
				var imgUrl = '';
				for(var i=0; i<6; i++) {
					imgUrl	+= possible.charAt(Math.random() * possible.length);
				}
								
				var tempPath	= req.file.path;
				var ext	= path.extname(req.file.originalname).toLowerCase();
				var targetPath = path.resolve('./public/upload/'+imgUrl+ext);
				if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
					fs.rename(tempPath, targetPath, function(err) {
						if(err) console.log(err);
						else res.redirect('/images/'+imgUrl);
						
					});
				}else {
					fs.unlink(tempPath, function(err) {
						//if(err) throw err;
						res.status(500).json({error : 'Only image files are allowed.'});
					});
				}
			};
			saveImage();
			res.send('The image : create Controller');
		},
		
		like : function(req, res) {
			res.json({likes :  1});
			//res.send('The image : like '+req.params.image_id+' Controller');
		}, 
		
		comment : function(req, res) {
			res.send('The image : comment '+req.params.image_id+'Controller');
		}
};