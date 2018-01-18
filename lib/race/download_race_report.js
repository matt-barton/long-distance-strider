const config = require('../config'),
  Race = require('./race'),
  get = require('../get'),
  fs = require('fs'),
  _ = require('underscore'),
  $ = require('cheerio');

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

function extractReport (html) {
  return new Promise ((resolve, reject) => {
    try {
      let report = $('div.entry-content', html).html();
      resolve(report);
    }
    catch (err) {
      reject(err);
    }
  });

}

function determineReportName (html) {
  return new Promise ((resolve, reject) => {
    try {
      let title = $('h1.entry-title', html).text();
      resolve(title);
    }
    catch (err) {
      return reject(err);
    }
 });
}

function determineDistance (html) {
  return new Promise((resolve, reject) => {
    let title;
    try {
      title = $('h1.entry-title', html).text().toLowerCase();
    }
    catch (err) {
      return reject(err);
    }

    let detectedDistance = 0,
      distances = {
        '10k': 6.2,
        '5k': 3.1,
        'half marathon': 13.1,
        'half-marathon': 13.1,
        'marathon' : 26.2
      };
 
    _(distances).keys().forEach(key => {
      if (title.match(key)) return resolve(distances[key]);
    });

    resolve();
  });
}

function determineRunners (html) {
  return new Promise ((resolve, reject) => {
    let runners = [];
    try {
      let namePos = -1;
      $('div.entry-content table tr:first-child td', html).each(function (idx, cell) {
        let text = $(cell).text();
        if (text.toLowerCase() === 'name') {
          namePos = ++idx;
        }
      });

      if (namePos === -1) {
        $('div.entry-content table tr:first-child th', html).each(function (idx, cell) {
          let text = $(cell).text();
          if (text.toLowerCase() === 'name') {
            namePos = ++idx;
          }
        });
         
      }
      
      if (namePos === -1) return reject(new Error('cannot determine name column in results table'));

      $('div.entry-content table tr td:nth-child(' + namePos + ')', html).each(function (idx, cell) {
        let name = $(cell).text().trim();
        if (name.toLowerCase() === 'name') return;
        runners.push(name);
      });
    }
    catch (err) {
      return reject(err);
    }
    resolve(runners);
  });
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
