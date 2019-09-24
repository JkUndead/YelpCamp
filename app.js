const express = require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local'),  
	  methodOverride = require('method-override'),
	  flash = require('connect-flash'),
	  //requiring objects in database
	  Campground = require('./models/campground'),
	  Comment = require('./models/comment'),
	  User = require('./models/user'),
	  //requiring routes
	  commentRoutes = require('./routes/comments'),
	  campgroundRoutes  =require('./routes/campgrounds'),
	  indexRoutes = require('./routes/index'),
	  
	  seedDB = require('./seeds');



mongoose.connect('mongodb://localhost:27017/yelp_camp_final', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
//this should come before passport config 
app.use(flash());


//seedDB(); //seed the database

//==========================
//PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'Ten is the cutest',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This function is used on every route
app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//using the routes
app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);


//====================

app.listen(3000,()=>{
    console.log('Server has started!');
});

