const express = require('express'),
  app = express(),
  jade = require('jade'),
  _ = require('underscore'),
  Race = require('../lib/db/race'),
  isAuth = require('../lib/auth_middleware');

app.get('/', isAuth, (req, res, next) => {
  try {
    Race.find({ ignore: false }, {url: 1, processed: 1}).exec().then(races => {
      console.log(races);
      var html = jade.compileFile('./client/src/templates/homepage.jade')({
        title: 'Home',
        auth: req.isAuthenticated(),
        newRaces: _(races).where({ processed: false }),
        processedRaces: _(races).where({ processed: true })
      });
      res.send(html);
    });
  } catch (e) {
    next(e);
  }
});

/*
app.get('/login', (req, res, next) => {
  try {
    var html = jade.compileFile('./client/src/templates/login.jade')({ title: 'Login', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.get('/about', (req, res, next) => {
  try {
    var html = jade.compileFile('./client/src/templates/about.jade')({ title: 'About', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.get('/contact', (req, res, next) => {
  try {
    var html = jade.compileFile('./client/src/templates/contact.jade')({ title: 'Contact', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});
*/

module.exports = app;