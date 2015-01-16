// var express = require('express');
// var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(app, passport){

  var Site = require('../sites/model').Site;

  /* GET login page. */
  app.get('/login', function(req, res) {
      // Display the Login page with any flash message, if any
    res.render('auth/login', { message: req.flash('message') });
  });

  /* Handle Login POST */
  app.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash : true  
  }));

  /* GET Registration Page */
  app.get('/signup', function(req, res){
    res.render('auth/register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  app.post('/signup', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  /* GET Home Page */
  app.get('/home', isAuthenticated, function(req, res){
    Site.find({user:req.user}).sort({date_created: -1}).exec(function (err, sites) {
          res.render('auth/home', { user: req.user, sites: sites})
      })
  });

  /* Handle Logout */
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // return app

}