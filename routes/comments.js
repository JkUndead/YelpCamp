const express = require('express'),
	  router = express.Router({mergeParams: true}),
	  Campground = require('../models/campground'),
	  middleware = require('../middleware'),
	  Comment = require('../models/comment');

//new comment route
router.get('/new',middleware.isLoggedIn,(req,res)=>{
	//find campground by id
	Campground.findById(req.params.id,(err,campground)=>{
		if(err)
			console.log(err);
		else
			res.render('comments/new',{campground: campground});
	});
});

//create comment route
router.post('/',middleware.isLoggedIn,(req,res)=>{
	//look up campground using id
	Campground.findById(req.params.id,(err,campground)=>{
		if(err){
			console.log(err);	
			res.redirect('/campgrounds');
		}
		else{
			Comment.create(req.body.comment,(err,comment)=>{
				if(err){
					req.flash('error', 'Something went wrong!');
					console.log(err);
				}	
				else{			
					//create new comment
					//add user name and id to comment
					//save the comment
					//connect new comment to campground
					//redirect campground show page
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success', 'Successfully added your comment');
					res.redirect('/campgrounds/' + campground._id);
				}
			})
		}
	})
});

//edit comment route
router.get('/:comment_id/edit',middleware.checkCommentOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err || !foundCampground){ //checking for null value
			req.flash('error','Campground not found');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){
				res.redirect('back');
			}else{
				res.render('comments/edit',{campground_id: req.params.id,comment: foundComment});
			}
		});
	});	
});

//update comment route
router.put('/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
		if(err){
			res.redirect('back');
		}else{
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
});

//destroy comment route
router.delete('/:comment_id',middleware.checkCommentOwnership,(req,res)=>{
	Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
		if(err){
			res.redirect('back');
		}else {
			req.flash('success', 'Comment deleted');
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
});




module.exports = router;

