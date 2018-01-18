const $ = require('cheerio');

module.exports = html => {
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
};