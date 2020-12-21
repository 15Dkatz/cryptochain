'use strict';

const { STARTING_BALANCE, REWARD_INPUT } = require('../config');
const { ec, cryptoHash } = require('../utils');
const Transaction = require('./transaction');

class Wallet {
  static calculateBalance({ chain, address, timestamp }) {
    let outputsTotal = 0,
    hasConductedTransaction = false,
    lessThanTimestamp = false;
    console.log('address', address);
    console.log('timestamp', timestamp);
    for( let i = chain.length -1 ; i > 0 ; i-- ) {

      console.log('index', i);
      console.log('blockTimestamp', chain[i].timestamp);
      console.log('blockComp', chain[i].timestamp <= timestamp);

      lessThanTimestamp = chain[i].timestamp <= timestamp;

      for ( let transaction of chain[i].data ) {

        console.log('transactionTimestamp', transaction.input.timestamp);
        console.log('transactionComp',transaction.input.timestamp > timestamp);
        console.log('transactionAddress', transaction.input.address);

        if(transaction.input.timestamp > timestamp) {
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
      console.log('has conduct transaction', hasConductedTransaction);
      console.log('lessThanTimestamp', lessThanTimestamp);
      console.log('outputsTotal', outputsTotal);


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
    if(chain) this.balance = Wallet.calculateBalance({ chain, address: this.publicKey, timestamp: Date.now() });

    if( amount > this.balance ) throw new Error('Amount exceeds balance');

    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

module.exports = Wallet;
