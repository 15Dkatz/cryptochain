'use strict';

const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { REWARD_INPUT } = require('../config');
const Block = require('../DB/models/blocks');
const { Transaction: TransactionModel } = require('../DB/models/transactions');
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
    TransactionModel.deleteMany().exec();
    // store block to mongoDB
    const block = new Block(this.blockchain.chain[this.blockchain.chain.length-1]);
    block.save();
  }
}

module.exports = Miner;
