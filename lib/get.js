const request = require('request');

module.exports = function(url) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      headers: {
        'User-Agent': 'LDS/1.0 (Long Distance Strider Web-App)'
      }
    }, (error, response, body) => {
      if (error || response.statusCode < 200 || response.statusCode > 299) {
        return reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      resolve(body);
    });
  });
};