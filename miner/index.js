'use strict';

const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { REWARD_INPUT } = require('../config');

class Miner {

  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    if(this.transactionPool.isEmpty()) throw new Error('TransactionPool is empty');

    // get the transaction's pool valid transactions
    const validTransactions = this.transactionPool.validTransactions();

    // generate the miner's reward
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );

    // add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: validTransactions });

    // broadcast the updated blockchain
    this.pubsub.broadcastChain();

    // clear the pool
    this.transactionPool.clear();
  }
}

module.exports = Miner;
