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
    if(transaction instanceof Transaction) this.transactionMap[transaction._id] = transaction;
    else this.transactionMap[transaction._id] = new Transaction({
      id: transaction._id,
      input: transaction.input,
      outputMap: transaction.outputMap
    });
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
        if(this.transactionMap[transaction._id]) {
          delete this.transactionMap[transaction._id];
        }
      }
    }
  }
}

module.exports = TransactionPool;
