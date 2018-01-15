const express = require('express'),
  app = express(),
  pug = require('pug'),
  _ = require('underscore'),
  Race = require('../lib/db/race'),
  Runner = require('../lib/db/runner'),
  isAuth = require('../lib/auth_middleware'),
  downloadNewRaces = require('../lib/download_new_races');

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

app.get('/race/:id', isAuth, (req, res, next) => {
  try {
    Race.findOne({ _id: req.params.id }).exec().then(race => {
      let html = pug.compileFile('./client/src/templates/race_details.pug')(_({
        title: 'LDS // ' + race.reportName,
        auth: req.isAuthenticated(),
      }).extend(race));
      res.send(html);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/ignore_race', isAuth, (req, res, next) => {
  try {
    Race.update({ _id: req.body.id }, { $set: { ignore: true }}).exec().then(() => {
      res.sendStatus(200);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/get-new-races', isAuth, (req, res, next) => {
  try {
    downloadNewRaces().then(newRaces => {
      res.status(200).json(newRaces);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/process_race', isAuth, (req, res, next) => {
  try {
    Race.findOne({ _id: req.body.id }).exec().then((race) => {
      let promises = race.runners.map(runnerName => {
        return Runner.findOne({ name: runnerName }).exec().then(rec => {
          if (rec) {
            return Runner.update({ _id: rec._id }, {
              $push: { 
                races: {
                  _id: race._id,
                  name: race.reportName,
                  distance: race.distance
                }},
              totalDistance: rec.totalDistance + race.distance });
          }
          else {
            return new Runner({
              name: runnerName,
              races: [{
                _id: race._id,
                name: race.reportName,
                distance: race.distance
              }],
              totalDistance: race.distance
            }).save();
          }
        });
      });

      return Promise.all(promises).then(() => {
        Race.update({ _id: req.body.id }, { $set: { processed: true }}).exec().then(() => {
          res.sendStatus(200);
        });
      });
    });
  }
  catch (e) {
    next(e);
  }
});

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