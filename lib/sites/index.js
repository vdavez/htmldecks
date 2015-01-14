var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

module.exports = function(app, passport) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    var Site = require("./model").Site
    var User = require("../auth/model").User

    // Routes ===========================================================
    app.get('/sites', isAuthenticated, function (req, res) {
        Site.find({}, function(err, sites) {
            res.send(sites)
        })
    })

    app.get('/site', isAuthenticated, function (req, res) {
        res.render('sites/form.html', {action: req.originalUrl})
    })

    app.post('/site', isAuthenticated, function (req, res) {
        var site = new Site({title: req.body.site_title, content: req.body.site_content, user:req.user._id})
        site.save()
        User.findByIdAndUpdate(req.user._id, {$push: {"sites": site._id}}, {safe: true, upsert: true}, function(err, model) {
            console.log(err);
        })
        res.redirect("/view/" + site._id)
    })

    app.post('/site/:id',isAuthenticated,  function (req, res) {
        var site = {title: req.body.site_title, content: req.body.site_content, user:req.user._id}
        Site.findByIdAndUpdate(req.params.id, site, {upsert:true}, function (err, s) {
            User.findByIdAndUpdate(req.user._id, {$push: {"sites": req.params.id}}, {safe: true, upsert: true}, function(err, model) {
                console.log(err);
            })
            res.redirect("/view/" + req.params.id)
        })
    })

    app.get('/site/:id', isAuthenticated, function (req, res) {
        Site.findOne({_id:req.params.id}, function(err, site) {
            res.render('sites/form.html', {action: req.originalUrl, form: site})
        })
    })

    app.get('/view/:id', isAuthenticated, function (req, res) {
        Site.findOne({_id:req.params.id}, function(err, site) {
            var divs = site.content.split('---').filter(function(v) {
                return v.replace(/\s/g, '');
            }).map(function(v) {
                return '<section data-markdown><script type="text/template">' + v + '</script></section>';
            }).join('\n');
            res.render("base", {"content":divs})
        })
    })
}