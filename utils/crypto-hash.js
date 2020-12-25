'use strict';

const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  hash.update(inputs.map(input => {
    if(input instanceof Array) {
      return cryptoHash(...input);
    }
    if(input instanceof Object) {
      return Object.entries(input).sort().flat();
    }
    return JSON.stringify(input);

  }).sort().join(' '));

  return hash.digest('hex');
};

module.exports = cryptoHash;
