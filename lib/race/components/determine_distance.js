const _ = require('underscore'),
  $ = require('cheerio');

module.exports = (html, reportTitle) => {
  return new Promise((resolve, reject) => {
    let title = reportTitle;
    if (!title) {
      try {
        title = $('h1.entry-title', html).text().toLowerCase();
      }
      catch (err) {
        return reject(err);
      }
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

    let regExs = [
      { multiplier: 1.609344, pattern: /([0-9]+)[ ]*kilo/ },
      { multiplier: 1, pattern: /([0-9]+)[ ]*mile/ },
    ];

    regExs.forEach(regex => {
      let results = regex.pattern.exec(title);
      if (results && results[1]) {
        return resolve(results[1] * regex.multiplier);
      }
    });
    resolve();
  });
};