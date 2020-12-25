'use strict';

const Transaction = require('./transaction');

class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  isEmpty() {
    return Object.keys(this.transactionMap).length === 0;
  }

  setTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;
  }

  existingTransaction({ inputAddress }) {
    return Object.values(this.transactionMap).find(transaction => transaction.input.address === inputAddress);
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  validTransactions() {
    return Object.values(this.transactionMap).filter(
      transaction => Transaction.validTransaction({ transaction })
    );
  }

  clear() {
    this.transactionMap = {};
  }

  clearBlockchainTransactions({ chain }) {
    for ( let i = 0 ; i < chain.length ; i++ ) {
      for( let transaction of chain[i].data ) {
        if(this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }
}

module.exports = TransactionPool;
