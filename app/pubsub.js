'use strict';

const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION'
};

class PubSub {
  constructor({ blockchain, transactionPool, io }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.io = io;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.#subscribeToChannels();
    this.subscriber.on('message', (channel, message) => this.#handleMessage(channel, message));
  }

  #handleMessage(channel, message) {
    console.log(`Channel : ${channel} - Message : ${message}.`);

    const parsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage });
          this.io.sockets.emit('sync');
        });
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        this.io.sockets.emit('sync');
        break;
      default:
        return;
    }
  }

  #subscribeToChannels() {
    Object.values(CHANNELS).forEach( channel => {
      this.subscriber.subscribe(channel);
    });
  }

  #publish({ channel, message }) {
    this.subscriber.unsubscribe( channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.#publish({ channel: CHANNELS.BLOCKCHAIN , message: JSON.stringify(this.blockchain.chain) });
  }

  broadcastTransaction(transaction) {
    this.#publish({ channel: CHANNELS.TRANSACTION, message: JSON.stringify(transaction) });
  }
}

module.exports = PubSub;
