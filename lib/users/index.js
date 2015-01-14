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
var User = require('../auth/model').User;

  app.get('/users', isAuthenticated, function (req, res) {
    if (req.user.admin) {
      User.find({}, function (err, users) {
        res.json(users)
      })
    }
    else {
      res.redirect('/login')
    }
  })
}