'use strict';

const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../utils');
const hexToBinary = require('hex-to-binary');

class Block {

  static genesis = new this(GENESIS_DATA);

  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock,
    nonce = 0,
    timestamp,
    hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if( difficulty < 1 ) return 1;
    return (timestamp - originalBlock.timestamp > MINE_RATE) ? difficulty -1 : difficulty +1;
  }

  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
}

module.exports = Block;
