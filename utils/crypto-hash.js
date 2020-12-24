'use strict';

const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  hash.update(inputs.map(input => {
    if(input instanceof Object && input.length !== 0) {
      return JSON.stringify(Object.entries(input).sort().reduce( (o,[k,v]) => (o[k]=v,o), {} ));
    }
    return JSON.stringify(input);
  }).sort().join(' '));
  return hash.digest('hex');
};

module.exports = cryptoHash;
