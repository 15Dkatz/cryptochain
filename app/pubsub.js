'use strict';

const redis = require('redis');
const Wallet = require('../wallet');

const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
  TRANSACTION: 'TRANSACTION',
  ADDRESS: 'ADDRESS'
};

class PubSub {
  constructor({ blockchain, transactionPool, io, redisUrl }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.io = io;
    this.publisher = redis.createClient(redisUrl);
    this.subscriber = redis.createClient(redisUrl);

    this.#subscribeToChannels();
    this.subscriber.on('message', (channel, message) => this.#handleMessage(channel, message));
  }

  #handleMessage(channel, message) {
    const parsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage });
        });
        this.io.emit('blocks');
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        this.io.emit('transaction');
        break;
      case CHANNELS.ADDRESS:
        parsedMessage.map( address => Wallet.knownAddresses.set(address[0], address[1]));
        this.io.emit('newAddress');
        break;
      default:
        console.log(`Channel : ${channel} - Message : ${message}.`);
        break;
    }
  }

  #subscribeToChannels() {
    Object.values(CHANNELS).forEach( channel => {
      this.subscriber.subscribe(channel);
    });
  }

  #publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }

  broadcastAddresses() {
    this.#publish({ channel: CHANNELS.ADDRESS , message: JSON.stringify(Array.from(Wallet.knownAddresses)) });
  }

  broadcastChain() {
    this.#publish({ channel: CHANNELS.BLOCKCHAIN , message: JSON.stringify(this.blockchain.chain) });
  }

  broadcastTransaction(transaction) {
    this.#publish({ channel: CHANNELS.TRANSACTION, message: JSON.stringify(transaction) });
  }
}

module.exports = PubSub;
