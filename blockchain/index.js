'use strict';

const Block = require('./block');
const { cryptoHash } = require('../utils');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {

  static #constructFromTab(chain) {
    chain[0] = Block.genesis;
    for( let i=1 ; i < chain.length ; i++ ) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      chain[i] = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });
    }
    return chain;
  }

  static isValidChain(chain) {
    const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[0];
    if (JSON.stringify({ timestamp, lastHash, hash, data, nonce, difficulty }) !== JSON.stringify(Block.genesis)) return false;
    for( let i = 1 ; i < chain.length ; i++ ) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      if(lastHash !== chain[i-1].hash) return false;
      if(hash !== cryptoHash(timestamp, lastHash, data, nonce, difficulty)) return false;
      if(Math.abs(chain[i-1].difficulty - difficulty) > 1) return false;
    }
    return true;
  }

  constructor() {
    this.chain = [Block.genesis];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length -1],
      data
    })
    this.chain.push(newBlock);
  }

  replaceChain(chain, validateTransactions, onSuccess) {
    if( chain.length <= this.chain.length ) {
      console.error('The incoming chain must be longer');
      return;
    }

    if( !Blockchain.isValidChain(chain) ) {
      console.error('The incoming chain must be valid');
      return;
    }

    if( validateTransactions && !this.validTransactionData({ chain }) ) {
      console.error('The incoming chain has invalid data');
      return
    }

    if(onSuccess) onSuccess();
    console.log('Replacing chain with', chain );
    this.chain = Blockchain.#constructFromTab(chain);
  }

  validTransactionData({ chain }) {
    for ( let i = 1 ; i < chain.length ; i++ ) {
      let rewardTransactionCount = 0;
      const transactionSet = new Set();

      for ( let transaction of chain[i].data ) {
        if( transaction.input.address === REWARD_INPUT.address ) {
          rewardTransactionCount += 1;

          if( rewardTransactionCount > 1 ) {
            console.error('Miner rewards exceed limit');
            return false;
          }
          const output = Object.values(transaction.outputMap);
          if( output.length !== 1 || output[0] !== MINING_REWARD ) {
            console.error('Miner reward amount is invalid');
            return false;
          }
        } else {
          if( !Transaction.validTransaction({ transaction }) ) {
            console.error('Invalid transaction');
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain,
            address: transaction.input.address,
            timestamp: chain[i-1].timestamp
          });

          if( transaction.input.amount !== trueBalance ) {
            console.error('Invalid input amount');
            return false;
          }

          if( transactionSet.has(transaction) ) {
            console.error('An identical transaction appears more than once in a block');
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }
}

module.exports = Blockchain;
