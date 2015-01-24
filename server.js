var express = require('express')
var app = express()

// app.get('*',function(req,res,next){
//   if(req.headers['x-forwarded-proto']!='https')
//     res.redirect('https://htmldecks.com'+req.url)
//   else
//     next() /* Continue to other routes if we're not redirecting */
// })

// Rendering template
var engines = require('consolidate');
swig = require('swig'),
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/lib/templates/');
app.set('view cache', false);
swig.setDefaults({ cache: false });

//Set up the stupidly simple database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/htmldecks');

var passport = require('passport')
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'changeme'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./lib/auth/init');
initPassport(passport);

var sites = require('./lib/sites')(app, passport);
var sites = require('./lib/users')(app, passport);
// app.use(sites);

var auth = require('./lib/auth')(app, passport);
// app.use(auth);

// Serve static files
app.use(express.static(__dirname + '/public'));

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})