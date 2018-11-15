const Transaction = require('../wallet/transaction');

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();

    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );

    this.blockchain.addBlock({ data: validTransactions });

    this.pubsub.broadcastChain();

    this.transactionPool.clear();
  }
}

module.exports = TransactionMiner;
