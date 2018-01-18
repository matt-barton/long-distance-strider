const _ = require('underscore'),
  $ = require('cheerio');

module.exports = html => {
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
};