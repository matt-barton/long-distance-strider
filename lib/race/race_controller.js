const express = require('express'),
  app = express(),
  pug = require('pug'),
  _ = require('underscore'),
  Race = require('./race'),
  Runner = require('../runner/runner'),
  isAuth = require('../auth_middleware'),
  downloadNewRaces = require('./download_new_races'),
  determineReportName = require('./components/determine_report_name'),
  determineDistance = require('./components/determine_distance'),
  determineRunners = require('./components/determine_runners');


app.get('/:id', isAuth, (req, res, next) => {
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

app.post('/ignore', isAuth, (req, res, next) => {
  try {
    Race.update({ _id: req.body.id }, { $set: { ignore: true }}).exec().then(() => {
      res.sendStatus(200);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/get-new', isAuth, (req, res, next) => {
  try {
    downloadNewRaces().then(newRaces => {
      res.status(200).json(newRaces);
    });
  }
  catch (e) {
    next(e);
  }
});

app.post('/rescan/:id', isAuth, (req, res, next) => {
  Race.findOne({ _id: req.params.id }).exec().then(race => {
 
    return extractData(race.reportHtml)
      .then(saveRace)
      .then(finish)
      .catch(error);
    
    function extractData (html) {
      let promises = [
        determineDistance(html, race.reportName),
        determineRunners(html)
      ];
      return Promise.all(promises);
    }
      
    function saveRace (raceData) {
      race.distance = raceData[0];
      race.runners = raceData[1];
      return race.save();
    }

    function finish () {
      return res.sendStatus(200);
    }

    function error (e) {
      console.log(e);
      return res.status(404).send(e);      
    }
  });
});

app.post('/process', isAuth, (req, res, next) => {
  try {
    Race.findOne({ _id: req.body.id }).exec().then(race => {
      let newRunners = 0,
        updatedRunners = 0,
        promises = race.runners.map(runner => {
        return Runner.findOne({ name: runner.name }).exec().then(rec => {
          if (rec) {
            updatedRunners++;
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
            newRunners++;
            return new Runner({
              name: runner.name,
              gender: runner.gender,
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
          res.status(200).send({
            newRunners: newRunners,
            updatedRunners: updatedRunners
          });
        });
      });
    });
  }
  catch (e) {
    next(e);
  }
});

module.exports = app;
