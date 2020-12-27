'use strict';

const Blockchain = require('../../blockchain');
const Block = require('../../blockchain/block');
const { cryptoHash } = require('../../utils');
const Wallet = require('../../wallet');
const Transaction = require('../../wallet/transaction');

describe('Blockchain', () => {
  let blockchain, newChain, originalChain, errorMock;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;

    errorMock = jest.fn();
    global.console.error = errorMock;
  });

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain).toBeInstanceOf(Array);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toBe(Block.genesis);
  });

  it('adds a new block to the chain', () => {
    const newData = 'foo-bar';
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length -1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    describe('when the chain does not start with the genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = { data: 'fake-genesis' };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain start with genesis block and has multiple blocks', () => {

      beforeEach(() => {
        blockchain.addBlock({ data: 'Bears'});
        blockchain.addBlock({ data: 'Beets'});
        blockchain.addBlock({ data: 'Beers'});
      });

      describe('and a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with an invalid field', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'some-bad-and-evil-data';
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length -1],
          lastHash = lastBlock.hash,
          timestamp = Date.now(),
          nonce = 0,
          data = [],
          difficulty = lastBlock.difficulty - 3,

          hash = cryptoHash(timestamp, lastHash, nonce, difficulty, data),

          badBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain does not contains any invalid blocks', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    })
  });

  describe('replaceChain()', () => {
    let logMock;

    beforeEach(() => {
      logMock = jest.fn();
      global.console.log = logMock;
    });

    describe('when the new chain is not longer than the original chain', () => {

      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' };
        blockchain.replaceChain(newChain.chain);
      });

      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer than the original chain', () => {

      beforeEach(() => {
        newChain.addBlock({ data: 'Bears'});
        newChain.addBlock({ data: 'Beets'});
        newChain.addBlock({ data: 'Beers'});
      });

      describe('and the new chain is invalid', () => {

        beforeEach(() => {
          newChain.chain[2].hash = 'some-fake-hash';
          blockchain.replaceChain(newChain.chain)
        });

        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the new chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it('logs about the chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });

    describe('and the `validateTransactions` flag is true', () => {
      it('calls `validTransactionData()`', () => {
        const validTransactionDataMock = jest.fn();
        blockchain.validTransactionData = validTransactionDataMock;
        newChain.addBlock({ data: 'foo' });
        blockchain.replaceChain(newChain.chain, true);
        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe('validTransactionData()', () => {
    let transaction, rewardTransaction, senderWallet, receiverWallet, knownAddresses;

    beforeEach(() => {
      knownAddresses = new Map();
      senderWallet = new Wallet({ username: 'toto', knownAddresses });
      receiverWallet = new Wallet({ username: 'titi', knownAddresses });
      transaction = senderWallet.createTransaction({ recipient: receiverWallet.publicKey, amount: 65 });
      rewardTransaction = Transaction.rewardTransaction({ minerWallet: senderWallet.publicKey });
    });

    describe('and the transaction data is valid', () => {
      it('returns true', () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true);
        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe('and the transaction data has multiple rewards', () => {
      it('returns false and logs an error', () => {
        newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('and the transaction has at least one malformed outputMap', () => {
      describe('and the transaction is not a reward transaction', () => {
        it('returns false and logs an error', () => {
          transaction.outputMap[receiverWallet.publicKey] = 999999;
          newChain.addBlock({ data: [transaction, rewardTransaction] });
          expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the transaction is a reward transaction', () => {
        it('returns false and logs an error', () => {
          rewardTransaction.outputMap[senderWallet.publicKey] = 999999;
          newChain.addBlock({ data: [transaction, rewardTransaction] });
          expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe('and the transaction data has at least one malformed input', () => {
      it('returns false and logs an error', () => {
        senderWallet.balance = 9000;

        const evilOutputMap = {
          [senderWallet.publicKey]: 8900,
          fooRecipient: 100
        };

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(evilOutputMap)
          },
          outputMap: evilOutputMap
        }

        newChain.addBlock({ data: [evilTransaction, rewardTransaction]});
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('and a block contains multiple identical transactions', () => {
      it('returns false and logs an error', () => {
        newChain.addBlock({ data: [transaction, transaction, transaction] });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
