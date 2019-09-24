const express = require('express'),
	  passport = require('passport'),
	  router = express.Router(),
	  User = require('../models/user');


//Home page route
router.get('/',(req,res)=>{
    res.render('landing');
});


//====================
// AUTH ROUTES

//register route
router.get('/register',(req,res)=>{
	res.render('register');
});

//sign up logic route
router.post('/register',(req,res)=>{ 
	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,(err,user)=>{
		if(err){
			req.flash('error',err.message);
			return res.redirect('/register');
		}
		passport.authenticate('local')(req,res,()=>{
			req.flash('success', 'Welcome to YelpCamp ' + user.username);
			res.redirect('/campgrounds');
		});
	});
});

//Login routes
router.get('/login',(req,res)=>{
	res.render('login');
});

//login logic route
router.post('/login',passport.authenticate('local',
	{
	successRedirect: '/campgrounds',
	failureRedirect: '/login'
	}),(req,res)=>{}
);
//Logout routes
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success', 'Loggout successfully');
	res.redirect('/campgrounds');
})


module.exports = router;








