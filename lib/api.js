const express = require('express'),
  app = express(),
  pug = require('pug'),
  _ = require('underscore'),
  raceController = require('./race/race_controller'),
  runnerController = require('./runner/runner_controller'),
  Race = require('./race/race'),
  isAuth = require('./auth_middleware');

app.get('/', isAuth, (req, res, next) => {
  try {
    Race.find({ ignore: false }, { reportName: 1, processed: 1 }).exec().then(races => {
      let html = pug.compileFile('./client/src/templates/race_list.pug')({
        title: 'LDS // Home',
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

app.use('/race', raceController);
app.use('/runner', runnerController);

/*
app.get('/login', (req, res, next) => {
  try {
    var html = pug.compileFile('./client/src/templates/login.pug')({ title: 'Login', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.get('/about', (req, res, next) => {
  try {
    var html = pug.compileFile('./client/src/templates/about.pug')({ title: 'About', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});

app.get('/contact', (req, res, next) => {
  try {
    var html = pug.compileFile('./client/src/templates/contact.pug')({ title: 'Contact', auth: req.isAuthenticated() });
    res.send(html);
  } catch (e) {
    next(e);
  }
});
*/

module.exports = app;