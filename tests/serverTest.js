var test = require('tape');
var request = require('supertest');
var app = require('../server');

var setup = require('./setup');

test('Load index page!', function (t) {
  t.plan(1)
  request(app)
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
      t.error(err, 'No error');
      t.end();
  })
});

test('Login User', function (t){
  request(app)
    .post('/login')
    .type('form')
    .field('inputUsername', 'adminUser')
    .field('inputPassword', 'something')
    .expect('Location','/login')
    .end(function (err, res){
      if (err) throw err;

      t.error(err, 'No error');
      t.end();        
    })
})