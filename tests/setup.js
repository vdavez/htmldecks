'use strict';
var User = require('../lib/auth/model').User;

var setup = {
  user: new User({"username":"adminUser","password":"password","email":"email@email.com","admin":true,"sites":[]}).save()
}

module.exports = setup;