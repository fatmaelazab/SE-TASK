var express = require('express');
var router = express.Router();
var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var Userfb = require('../models/fbUser');
var configAuth = require('../config/auth');
var FacebookStrategy = require('passport-facebook').Strategy;
var firebase = require('firebase');

var provider = new firebase.auth.FacebookAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
	var errorMessage = error.message;
	
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

router.get('/', function(req, res){
	res.render('welcome');
});


// Get Register Page
router.get('/register',function(req, res){
	res.render('register');
});

// Get Login Page
router.get('/login',function(req, res){
	res.render('login');
});

router.get('/profile',function(req,res) {
	res.render('profile');
});
router.get('/fbprofile',function(req,res) {
	res.render('fbProfile');
});

// Post Students Registration
router.post('/register',function(req, res){
   var firstName= req.body.firstName;
	 var lastName= req.body.lastName;
	 var email= req.body.email;
	 var username= req.body.username;
	 var password= req.body.password;
	 var password2 = req.body.password2;

	 //Validation
 req.checkBody('firstName','First Name is Required').notEmpty();
 req.checkBody('lastName','Last Name is Required').notEmpty();
 req.checkBody('email','Email is Required').isEmail();
 req.checkBody('username','Username is Required').notEmpty();
 req.checkBody('password','Password is Required').notEmpty();
 req.checkBody('password2','Passwords do not match').equals(req.body.password);


 var errors = req.validationErrors();

 if(errors){
	  res.render('register',{
			errors: errors
		});

 }else{
    var newUser = new User()
			newUser.firstName= firstName;
			newUser.lastName= lastName;
			newUser.email= email;
			newUser.username= username;
			newUser.password= password;
			newUser.password2= password2;
	

		User.createUser(newUser,function(err,user){
			if(err) throw err;
		});
		req.flash('success_msg','Welcome, You can now login');
		res.redirect('/login');
 }

});

passport.use(new LocalStrategy(
	function(username,password, done) {
	 User.getUserByUsername(username,function(err,users){
		   if(err) throw err;
			   if(!users){
				  return done(null,false,{message: 'Unkown Username'});
			  }
			  User.comparePassword(password,users.password,function(err,isMatch){
				  if(err) throw err;
				  if(isMatch){
					  return done(null,users);
				  }
				  else{
					  return done(null,false,{message:'Invalid password'});
				  }
			  });
	   });
	}
  ));

  passport.serializeUser(function(user, done) {
	done(null, user.id);
  });
  
  
  passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
	  done(err, user);
	});
  });
  

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/login');
	}
}

router.post('/login',
passport.authenticate('local',{succesRedirect:'/',failureRedirect:'/login',
failureFlash: true}),
  function(req, res) {
  res.redirect('/profile');
});

router.get('/logout',function(req,res){
req.logout();

  req.flash('success_msg','You are logged out');

  res.redirect('/login');
});



//FACEBOOK


passport.use(new FacebookStrategy({
	clientID: configAuth.facebookAuth.clientID,
	clientSecret: configAuth.facebookAuth.clientSecret,
	callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {

	process.nextTick(function(){
	   User.findOne({'facebook.id': profile.id},function(err,user){
		 if(err)
		   return done(err)
		   if(user)
		   return done(null,user);
		   else{
			   var newUser = new User();
			   newUser.facebook.id = profile.id;
			   newUser.facebook.token = accessToken;
			  // newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
			  // newUser.facebook.email = profile.emails[0].value; 

			   newUser.save(function(err){
				   if(err)
				   throw err;
				   return done(null,newUser);
			})
		   }

	   });
	});
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});




// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/fbprofile',
                                      failureRedirect: '/' }));



									  

module.exports = router;
