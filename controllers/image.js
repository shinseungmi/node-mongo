var fs = require('fs');
var path = require('path');
var sidebar = require('../helpers/sidebar');
var Models	= require('../models');
var md5	= require('MD5');
module.exports = {
		index : function(req, res) {
			var viewModel = {
					image : {},					
					comments : []					
			};
			
			Models.Image.findOne({filename : {$regex : req.params.image_id}}, function(err, image) {
				if(err) throw err;
				if(image) {
					image.views = image.views + 1;
					viewModel.image = image;
					image.save();
					
					Models.Comment.find({image_id : image._id}, {}, {sort : {'timestamp' : 1}}, function(err, comments) {
						if(err) throw err;
						viewModel.comments = comments;
						sidebar(viewModel, function(viewModel) {
							res.render('image', viewModel);
						});
					})
				}else {
					res.redirect('/');
				}
			});
			
		},

		create : function(req, res) {
			var saveImage = function() {
				var possible = 'abcdefghijklmnopqrstuwxyz';
				var imgUrl = '';
				for(var i=0; i<6; i++) {
					imgUrl	+= possible.charAt(Math.random() * possible.length);
				}
				
				Models.Image.find({filename : imgUrl}, function(err, images) {
					if(images.length > 0) {
						saveImage();
					}else {
						var tempPath	= req.file.path;
						var ext	= path.extname(req.file.originalname).toLowerCase();
						var targetPath = path.resolve('./public/upload/'+imgUrl+ext);
						if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
							fs.rename(tempPath, targetPath, function(err) {
								if(err) console.log(err);
								else {
									//res.redirect('/images/'+imgUrl);
									var newImage = new Models.Image({
										title : req.body.title,
										decription : req.body.description,
										filename : imgUrl+ext
									});
									
									newImage.save(function(err, image) {
										console.log('Succesfully inserted image : '+image.filename);
										res.redirect('/images/'+image.uniqueId);
									});
								}
								
							});
						}else {
							fs.unlink(tempPath, function(err) {
								//if(err) throw err;
								res.status(500).json({error : 'Only image files are allowed.'});
							});
						}
					}
				});
				
			};
			saveImage();
			res.send('The image : create Controller');
		},
		
		like : function(req, res) {
			Models.Image.findOne({filename : {$regex : req.params.image_id}}, function(err, image) {
				if(!err && image) {
					image.likes	= image.likes + 1;
					image.save(function(err) {
						if(err) res.json(err);
						else res.json({likes : image.likes});
					})
				}
			});
		}, 
		
		comment : function(req, res) {
			Models.Image.findOne({filename : {$regex : req.params.image_id}}, function(err, image) {
				if(!err && image) {
					
					for(key in req) {
						console.log('----'+key);
					}
					var newComment = new Models.Comment();
					newComment.comment = req.params.comment;
					newComment.gravatar = md5(newComment.email);
					newComment.image_id = image._id;
					newComment.save(function(err, comment) {
						if(err) throw err;
						res.redirect('/images/'+image.uniqueId+'#'+comment._id);
					});
				}else {
					res.redirect('/');
				}
			});
			res.send('The image : comment '+req.params.image_id+'Controller');
		}
};