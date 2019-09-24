const express = require('express'),
	  Campground = require('../models/campground'),
	  Comment = require('../models/comment'),
	  middleware = require('../middleware'),
	  router = express.Router();


//INDEX - show all campgrounds
router.get('/',(req,res)=>{
	//Get all the campgrounds from db
	Campground.find({}, (err, allCampgrounds)=>{
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/index',{campgrounds: allCampgrounds});
		}
	});
});

//NEW - show form to create new campground
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    res.render('campgrounds/new');
});

// CREATE - add new campground
router.post('/',middleware.isLoggedIn,(req,res)=>{
	//taking user input + user details
    const name = req.body.name;
    const image = req.body.image;
	const desc = req.body.description;
	const price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
    const newCampground = {name: name, image: image, description: desc, author: author, price: price};
    //Create a new campground and save to db
	Campground.create(newCampground, (err, newlyCreated) =>{
		if(err) {
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

//SHOW - show info about one campground
router.get('/:id', (req,res) =>{
	//find the campground with provided id
	//using populate+exec to find comments associate with the camps
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) =>{
		if(err || !foundCampground) {
			req.flash('error','Campground not found');
			res.redirect('back');
		} else {
			//render to show template
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

//EDIT CAMPS ROUTES

router.get('/:id/edit',middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err,foundCampground)=>{
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/edit',{campground:foundCampground});
		}
		
	});
});

//UPDATE CAMPS ROUTES
router.put('/:id',middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err,updatedCampground)=>{
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});

//DESTROY CAMPS ROUTES
router.delete('/:id',middleware.checkCampgroundOwnership,(req,res,next)=>{
	Campground.findById(req.params.id,(err,campground)=>{
		if(err)
			return next(err);
		campground.remove();
		res.redirect('/campgrounds');	
	});
});




module.exports = router;



