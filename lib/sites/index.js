var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}

var fs = require('fs');

module.exports = function(app, passport) {
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    var Site = require("./model").Site
    var User = require("../auth/model").User

    // Routes ===========================================================
    app.get('/sites', isAuthenticated, function (req, res) {
        if (req.user.admin) {
            Site.find({}, function(err, sites) {
                res.send(sites)
            })
        }
        else {
            res.redirect('/login')
        }
    })

    app.get('/site', isAuthenticated, function (req, res) {
        res.render('sites/form.html', {action: req.originalUrl})
    })

    app.post('/site', isAuthenticated, function (req, res) {
        var date_created = new Date().toString()
        is_private = (req.body.is_private == "true" ? true : false)
        var theme = req.body.theme || "simple"
        var site = new Site({title: req.body.site_title, content: req.body.site_content, user:req.user._id, date_created: date_created, theme: theme, is_private: is_private})
        site.save()
        User.findByIdAndUpdate(req.user._id, {$push: {"sites": site._id}}, {safe: true, upsert: true}, function(err, model) {
        })
        res.redirect("/view/" + site._id)
    })

    app.post('/site/:id',isAuthenticated,  function (req, res) {
        var theme = req.body.theme || "simple"
        is_private = (req.body.is_private == "true" ? true : false)
        var site = {title: req.body.site_title, content: req.body.site_content, user:req.user._id, theme: theme, is_private: is_private}
        Site.findById(req.params.id, function (err, thisSite) {
            if (req.user.id != thisSite.user.toString()) {
                res.redirect('/home')
            }
            else {
                Site.findByIdAndUpdate(req.params.id, site, {upsert:true}, function (err, s) {
                    res.redirect("/view/" + req.params.id)
                })
            }
        })
    })

    app.get('/site/:id', isAuthenticated, function (req, res) {
        Site.findById(req.params.id, function (err, site) {
            if (req.user.id != site.user.toString()) {

                res.redirect('/home')
            }
            else {

                Site.findOne({_id:req.params.id}, function(err, site) {
                    res.render('sites/form.html', {action: req.originalUrl, form: site})
                })
            }
        })
    })

    app.get('/site/:id/delete', isAuthenticated, function (req, res) {
        Site.findById(req.params.id, function (err, site) {
            if (req.user.id != site.user.toString()) {
                res.redirect('/home')
            }
            else {
                Site.findByIdAndRemove(req.params.id, function(err, site) {
                    res.redirect('/home')
                })
            }
        })
    })

    app.get('/view/:id', function (req, res) {
        Site.findOne({_id:req.params.id}, function(err, site) {
            
            if (site.is_private == true) {
                if (req.user != undefined && req.user.id == site.user){
                    var divs = site.content.split('---').filter(function(v) {
                        return v.replace(/\s/g, '');
                    }).map(function(v) {
                        return '<section data-markdown><script type="text/template">' + v + '</script></section>';
                    }).join('\n');
                    res.render("base", {"title":site.title, "content":divs, "id":req.params.id, "theme":site.theme})
                }
                else {
                    res.redirect('/')

                }
            }
            else {
                var divs = site.content.split('---').filter(function(v) {
                    return v.replace(/\s/g, '');
                }).map(function(v) {
                    return '<section data-markdown><script type="text/template">' + v + '</script></section>';
                }).join('\n');
                res.render("base", {"title":site.title, "content":divs, "id":req.params.id, "theme":site.theme})
            }
        })
    })

    app.get('/', function (req, res) {
        if (req.user) {res.redirect('/home')}
            site = fs.readFileSync('./lib/templates/index.html', {encoding:'utf-8'})
            var divs = site.split('---').filter(function(v) {
                return v.replace(/\s/g, '');
            }).map(function(v) {
                return '<section data-markdown><script type="text/template">' + v + '</script></section>';
            }).join('\n');
            res.render("base", {"content":divs, "title": "Welcome to HTML Decks", "theme":'white'})
        })
}