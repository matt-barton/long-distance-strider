const config = require('./config'),
  fs = require('fs'),
  get = require('./get'),
  $ = require('cheerio'),
  Race = require('./db/race');

const url = 'http://www.steelcitystriders.co.uk/race-results-list/';

//get(url)
//  .then(saveHtml);
readHtml()
  .then(getRaceReportUrls)
  .then(getSavedRaces)
  .then(x => console.log(x));

function getRaceReportUrls (html) {
  return new Promise((resolve, reject) => {
    $('ul.archive-list', html).each((idx, ul) => {
      let header = $(ul).prev().text();
    
      if (header.match(process.env.ldsYear)) {
        let urls = [];
        $('li a', ul).each((idx, link) => {
          urls.push($(link).prop('href'));
        });
        resolve(urls);
      }
    });
  });  
}

function getSavedRaces (foundRaceUrls) {
  return Race.find({}, { url: 1} )
    .exec()
    .then(races => {
      console.log(races);
      return {
        foundRaceUrls: foundRaceUrls,
        savedRaces: races};
    });
}

function saveHtml (html) {
  return new Promise ((resolve, reject) => {
    fs.writeFile ('race-listing.html', html, (err) => {
      if (err) return reject(err);
        resolve(html);
      });
  });
}

function readHtml () {
  return new Promise((resolve, reject) => {
    fs.readFile('race-listing.html', 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
  