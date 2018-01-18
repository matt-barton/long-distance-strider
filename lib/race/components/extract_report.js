const $ = require('cheerio');

module.exports = html => {
  return new Promise ((resolve, reject) => {
    try {
      let report = $('div.entry-content', html).html();
      resolve('<div class="entry-content">' + report + '</div>');
    }
    catch (err) {
      reject(err);
    }
  });
};