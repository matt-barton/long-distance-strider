const express = require('express'),
  app = express(),
  pug = require('pug'),
  _ = require('underscore'),
  Runner = require('./runner'),
  isAuth = require('../auth_middleware');

app.get('/', isAuth, (req, res, next) => {
  try {
    Runner.find().sort({ totalDistance: -1 }).exec().then(runners => {
      let html = pug.compileFile('./client/src/templates/runners_list.pug')({
        title: 'LDS // Runners',
        auth: req.isAuthenticated(),
        runners: runners
      });
      res.send(html);
    });
  }
  catch (e) {
    next(e);
  }
});

app.get('/:id', isAuth, (req, res, next) => {
  try {
    Runner.findOne({ _id: req.params.id }).exec().then(runner => {
      let html = pug.compileFile('./client/src/templates/runner_details.pug')(_({
        title: 'LDS // ' + runner.name,
        auth: req.isAuthenticated(),
      }).extend(runner));
      res.send(html);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/gender', isAuth, (req, res, next) => {
  try {
    Runner.update(
      { _id: req.body.id },
      { $set: { gender: req.body.gender}}
    ).exec().then(runner => {
      res.sendStatus(200);
    });
  }
  catch (e) {
    next(e);
  }
});

module.exports = app;