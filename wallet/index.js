'use strict';

const { STARTING_BALANCE, REWARD_INPUT } = require('../config');
const { ec, cryptoHash } = require('../utils');
const Transaction = require('./transaction');

class Wallet {
  static calculateBalance({ chain, address, timestamp }) {
    let outputsTotal = 0,
    hasConductedTransaction = false,
    lessThanTimestamp = false;

    for( let i = chain.length -1 ; i > 0 ; i-- ) {
      lessThanTimestamp = chain[i].timestamp <= timestamp;

      for ( let transaction of chain[i].data ) {

        if(transaction.input.timestamp >= timestamp) {
          continue;
        }

        if(transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if(addressOutput) {
          outputsTotal += addressOutput;
        }
      }
      if(hasConductedTransaction && lessThanTimestamp) break;
    }

    return hasConductedTransaction ?
    outputsTotal :
    STARTING_BALANCE + outputsTotal;

  }

  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount, chain }) {
    if(recipient === this.publicKey) throw new Error('You can\'t spend money to yourself');
    if(chain) this.balance = Wallet.calculateBalance({ chain, address: this.publicKey, timestamp: Date.now() });
    if( amount > this.balance ) throw new Error('Amount exceeds balance');
    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

module.exports = Wallet;
