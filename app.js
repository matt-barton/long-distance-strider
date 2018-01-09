let get = require('./lib/get'),
  fs = require('fs'),
  $ = require('cheerio');

let url = 'http://www.steelcitystriders.co.uk/2018/puglia-marathon-results/';

//get(url)
//  .then(saveHtml)
readHtml()
  .then(extractData)
  .then(updateRunners)
  .catch(errorHandler);

function readHtml () {
  return new Promise((resolve, reject) => {
    fs.readFile('race-report.html', 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

function saveHtml (html) {
  return new Promise ((resolve, reject) => {
    fs.writeFile ('race-report.html', html, (err) => {
      if (err) return reject(err);
      resolve(html);
    });
  });
}

function extractData (html) {

  let promises = [
    determineDistance(html),
    determineRunners(html)
  ]

  return Promise.all(promises);
}

function determineDistance (html) {
  let title = $('h1.entry-title', html).text();
  console.log(title);
  console.log('TODO: determine distance');
  return Promise.resolve('no distance');
}

function determineRunners (html) {
  return new Promise ((resolve, reject) => {
    let runners;
    try {
      let namePos = -1;
      $('div.entry-content table tr:first-child td', html).each(function (idx, cell) {
        let text = $(cell).text();
        if (text.toLowerCase() === 'name') {
          namePos = ++idx;
        }
      });
      console.log('name column: ' + namePos);
      console.log('TODO: determine runners');
    }
    catch (err) {
      console.log(err);
    }
    return resolve(runners ? runners : 'no runners');
  });
}

function updateRunners (runnerData) {
  console.log(runnerData);
  console.log('TODO: update runners');
  return Promise.resolve();
}

function errorHandler (err) {
  console.error(err.stack);
}