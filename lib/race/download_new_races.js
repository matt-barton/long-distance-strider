const config = require('../config'),
  fs = require('fs'),
  get = require('../get'),
  $ = require('cheerio'),
  _ = require('underscore'),
  Race = require('./race'),
  downloadRaceReport = require('./download_race_report'),
  url = 'http://www.steelcitystriders.co.uk/race-results-list/';

module.exports = () => {
  return get(url)
    .then(getRaceReportUrls)
    .then(getSavedRaces)
    .then(identifyNewRaces)
    .then(downloadNewRaces);
};

function getRaceReportUrls (html) {
  return new Promise((resolve, reject) => {
    let raceReportUrls = [];

    $('ul.archive-list', html).each((idx, ul) => {
      let header = $(ul).prev().text();
    
      if (header.match(process.env.LDS_YEAR)) {
        $('li a', ul).each((idx, link) => {
          raceReportUrls.push($(link).prop('href'));
        });
      }
    });
    resolve(raceReportUrls);
    
  });  
}

function getSavedRaces (foundRaceUrls) {
  return Race.find({}, { url: 1 } )
    .exec()
    .then(races => {
      return {
        foundRaceUrls: foundRaceUrls,
        savedRaces: races.map(x => x.url)};
    });
}

function identifyNewRaces (data) {
  return new Promise(resolve => {
    let savedRaces = _(data.savedRaces),
      newRaces = [];

    data.foundRaceUrls.forEach(url => {
      if (!savedRaces.contains(url)) newRaces.push(url)
    });

    resolve(newRaces);
  });
}

function downloadNewRaces (newRaceUrls) {
  let promises = newRaceUrls.map(downloadRaceReport);

  return Promise.all(promises);
}