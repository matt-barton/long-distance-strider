const config = require('../config'),
  Race = require('./race'),
  get = require('../get'),
  fs = require('fs'),
  _ = require('underscore'),
  $ = require('cheerio'),
  extractReport = require('./components/extract_report'),
  determineReportName = require('./components/determine_report_name'),
  determineDistance = require('./components/determine_distance'),
  determineRunners = require('./components/determine_runners');

module.exports = url => {
  return get(url)
    .then(extractData)
    .then(saveRace.bind(this, url))
    .catch(errorHandler);
};

function extractData (html) {

  let promises = [
    extractReport(html),
    determineReportName(html),
    determineDistance(html),
    determineRunners(html)
  ]

  return Promise.all(promises);
}

function saveRace (url, raceData) {
  let race = new Race({
    url: url,
    reportHtml: raceData[0],
    reportName: raceData[1],
    distance: raceData[2],
    runners: raceData[3]
  });

  return race.save();
}

function errorHandler (err) {
  console.error(err.stack);
}
