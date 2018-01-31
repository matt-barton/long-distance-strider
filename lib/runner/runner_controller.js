const express = require('express'),
  app = express(),
  pug = require('pug'),
  _ = require('underscore'),
  Runner = require('./runner'),
  Race = require('../race/race'),
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
    getRunner()
      .then(getUnprocessedRaces)
      .then(renderResults);
  
    function getRunner () {
      return Runner.findOne({ _id: req.params.id }).exec(); 
    }

    function getUnprocessedRaces (runner) {
      return Race.find({ processed: false, ignore: false }).sort({ reportName: 1 }).exec().then(races => {
        return {
          unprocessedRaces: races,
          runner: runner
        };
      });
    }

    function renderResults (data) {
      let html = pug.compileFile('./client/src/templates/runner_details.pug')(_({
        title: 'LDS // ' + data.runner.name,
        auth: req.isAuthenticated(),
      }).extend(data));
      res.send(html);
    }
  }
  catch (e) {
    next(e);
  }
});

app.post('/gender/:id', isAuth, (req, res, next) => {
  try {
    Runner.update(
      { _id: req.params.id },
      { $set: { gender: req.body.gender}}
    ).exec().then(runner => {
      res.sendStatus(200);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/:id/add-race', isAuth, (req, res, next) => {
  try {

    Race.findOne({ _id: req.body.race }).exec()
      .then(updateRunner)
      .then(returnSuccess)
      .catch(returnError);

    function updateRunner (race) {
      return Runner.update(
        { _id: req.params.id },
        { 
          $inc: { totalDistance: req.body.distance },
          $push: { races: {
          _id: race._id,
          name: race.reportName,
          distance: req.body.distance
        }}}
      ).exec();
    }

    function returnSuccess () {
      res.sendStatus(200);
    }

    function returnError (e) {
      res.status(400).send(e);
    }
  }
  catch (e) {
    next(e);
  }
});

module.exports = app;