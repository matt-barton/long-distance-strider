const $ = require('cheerio');

module.exports = html => {
  return new Promise ((resolve, reject) => {
    try {
      let title = $('h1.entry-title', html).text();
      resolve(title);
    }
    catch (err) {
      return reject(err);
    }
  });
};