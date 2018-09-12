const $ = require('cheerio');

module.exports = html => {
  return new Promise ((resolve, reject) => {
    let runners = [];
    try {
      let namePos = -1;
      $('table tr:first-child td', html).each(function (idx, cell) {
        let text = $(cell).text();
        if (text.toLowerCase() === 'name') {
          namePos = idx;
        }
      });

      if (namePos === -1) {
        $('table tr:first-child th', html).each(function (idx, cell) {
          let text = $(cell).text();
          if (text.toLowerCase() === 'name') {
            namePos = idx;
          }
        });         
      }
      
      if (namePos === -1) return reject(new Error('cannot determine name column in results table'));

      let catPos = -1;
      $('table tr:first-child td', html).each(function (idx, cell) {
        let text = $(cell).text();
        if (text.toLowerCase().substring(0, 3) === 'cat') {
          catPos = idx;
        }
      });

      if (catPos === -1) {
        $('table tr:first-child th', html).each(function (idx, cell) {
          let text = $(cell).text();
          if (text.toLowerCase().substring(0, 3) === 'cat') {
            catPos = idx;
          }
        });         
      }

      $('table tr', html).each((idx, row) => {
        if (idx === 0) return;
        let runner = { name: '', gender: '' };
        $('td', row).each((idx, cell) => {
          let content = $(cell).text().trim();
          if (idx === namePos) runner.name = content;
          if (catPos && idx === catPos) {
            content = content.toLowerCase();
            if (content.match('m')) return runner.gender = 'man';
            if (content.match('f')) return runner.gender = 'woman';
            if (content.match('w')) return runner.gender = 'woman';
          }
        });
        runners.push(runner);
      });
    }
    catch (err) {
      return reject(err);
    }
    resolve(runners);
  });
};