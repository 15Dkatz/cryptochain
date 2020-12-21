'use strict';

const redis = require('redis');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  ADDRESS: 'ADDRESS'
};

class PubSub {
  constructor({ addresses, blockchain, transactionPool, io }) {
    this.addresses = addresses;
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.io = io;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.#subscribeToChannels();
    this.subscriber.on('message', (channel, message) => this.#handleMessage(channel, message));
  }

  #handleMessage(channel, message) {
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
      case CHANNELS.ADDRESS:
        this.addresses.add(parsedMessage);
        this.io.emit('newAddress');
      default:
        console.log(`Channel : ${channel} - Message : ${message}.`);
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

  broadcastAddresses() {
    this.#publish({ channel: CHANNELS.ADDRESS , message: JSON.stringify(this.addresses) });
  }

  broadcastChain() {
    this.#publish({ channel: CHANNELS.BLOCKCHAIN , message: JSON.stringify(this.blockchain.chain) });
  }

  broadcastTransaction(transaction) {
    this.#publish({ channel: CHANNELS.TRANSACTION, message: JSON.stringify(transaction) });
  }
}

module.exports = PubSub;
