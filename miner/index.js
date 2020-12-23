'use strict';

const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { REWARD_INPUT } = require('../config');
const blockModel = require('../DB/models/block');

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

    if(validTransactions.length < 1) throw new Error('No valid Transaction');

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

    // store block to mongoDB
    const block = new blockModel({
      ...this.blockchain.chain[this.blockchain.chain.length-1]
    });
    block.save((err) => {
      if(err) throw err;
    });

  }
}

module.exports = Miner;
