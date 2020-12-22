'use strict';

const Block = require('./block');
const { cryptoHash } = require('../utils');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) return false;

    for( let i = 1 ; i < chain.length ; i++ ) {
      if(chain[i].lastHash !== chain[i-1].hash) return false;

      if(chain[i].hash !== cryptoHash(chain[i].timestamp, chain[i].lastHash, chain[i].data, chain[i].nonce, chain[i].difficulty)) return false;

      if(Math.abs(chain[i-1].difficulty - chain[i].difficulty) > 1) return false;
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
      return;
    }

    if(onSuccess) onSuccess();
    console.log('Replacing chain with', chain );
    this.chain = chain;
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
