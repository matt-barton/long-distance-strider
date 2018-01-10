const config = require('./lib/config'),
  Race = require('./lib/db/race'),
  get = require('./lib/get'),
  fs = require('fs'),
  _ = require('underscore'),
  $ = require('cheerio');

//let url = 'http://www.steelcitystriders.co.uk/2018/puglia-marathon-results/';
let url = 'http://www.steelcitystriders.co.uk/2018/sir-titus-trot-trail-marathon-2018-result/';
//get(url)
//  .then(saveHtml)
readHtml()
  .then(extractData)
  .then(updateRunners)
  .catch(errorHandler);

function readHtml () {
  return new Promise((resolve, reject) => {
    fs.readFile('race-report2.html', 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function saveHtml (html) {
  return new Promise ((resolve, reject) => {
    fs.writeFile ('race-report2.html', html, (err) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
}

function extractData (html) {

  let promises = [
    extractReport(html),
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
        let name = $(cell).text();
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

function updateRunners (raceData) {
  let race = new Race({
    url: url,
    report: raceData[0],
    distance: raceData[1],
    runners: raceData[2]
  });

  return race.save();
}

function errorHandler (err) {
  console.error(err.stack);
}