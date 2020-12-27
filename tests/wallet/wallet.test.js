'use strict';

const Wallet = require('../../wallet');
const Transaction = require('../../wallet/transaction');
const { verifySignature } = require('../../utils');
const Blockchain = require('../../blockchain');
const { STARTING_BALANCE } = require('../../config');

describe('Wallet', () => {
  let wallet, wallet2, knownAddresses;

  beforeEach(() => {
    knownAddresses = new Map();
    wallet = new Wallet({ username: 'toto', knownAddresses });
    wallet2 = new Wallet({ username: 'titi', knownAddresses });
  });

  it('has a `balance`', () => {
    expect(wallet).toHaveProperty('balance');
  });

  it('has a `publicKey`', () => {
    expect(wallet).toHaveProperty('publicKey');
  });

  it('has `knownAddresses`', () => {
    expect(wallet).toHaveProperty('knownAddresses');
  });

  describe('signing data', () => {
    const data = 'foo-bar';

    it('verifies signature', () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data)
        })
      ).toBe(true);
    });

    it('does not verify an invalid signature', () => {
      expect(
        verifySignature({
           publicKey: wallet.publicKey,
           data,
           signature: new Wallet({ username: 'tata', knownAddresses }).sign(data)
         })
       ).toBe(false);
    });
  });

  describe('createTransaction()', () => {
    describe('and the address is unknown', () => {
      it('throws an error', () => {
        expect(
          () => wallet.createTransaction({ amount: 10, recipient: 'foo-recipient' })
        ).toThrow('Unknown address');
      });
    });

    describe('and you try to spend money to yourself', () => {
      it('throws an error', () => {
        expect(
          () => wallet.createTransaction({ amount: 10, recipient: wallet.publicKey })
        ).toThrow('You can\'t spend money to yourself');
      });
    });

    describe('and the `amount` exceeds the `balance`', () => {
      it('throws an error', () => {
        expect(
          () => wallet.createTransaction({ amount: 999999, recipient: wallet2.publicKey })
        ).toThrow('Amount exceeds balance');
      });
    });

    describe('and the `amount` is valid', () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = wallet2.publicKey;
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it('creates an instance of `Transaction`', () => {
        expect(transaction).toBeInstanceOf(Transaction);
      });

      it('matches the transaction input with the wallet', () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it('output the amount of the recipient', () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });

    describe('and a chain is passed', () => {
      it('calls `Wallet.calculateBalance()`', () => {
        const calculateBalanceMock = jest.fn();
        const originalCalculateBalance = Wallet.calculateBalance;
        Wallet.calculateBalance = calculateBalanceMock;
        wallet.createTransaction({
          recipient: wallet2.publicKey,
          amount: 10,
          chain: new Blockchain().chain
        });
        expect(calculateBalanceMock).toHaveBeenCalled();
        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe('calculateBalance()', () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new Blockchain();
    });

    describe('and there are no outputs for the wallet', () => {
      it('returns the `STARTING_BALANCE`', () => {
        expect(
          Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey, timestamp: Date.now() })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe('and there are outputs for the wallet', () => {
      let transactionOne, transactionTwo;

      beforeEach(() => {
        transactionOne = new Wallet({ username: 'tonton', knownAddresses }).createTransaction({
          recipient: wallet.publicKey,
          amount: 50
        });

        transactionTwo = new Wallet({ username: 'tutu', knownAddresses }).createTransaction({
          recipient: wallet.publicKey,
          amount: 60
        });

        blockchain.addBlock({ data: [transactionOne, transactionTwo] });
      });

      it('adds the sum of all outputs to the wallet balance', () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
            timestamp: Date.now()
          })
        ).toEqual(STARTING_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey]);
      });

      describe('and the wallet has made transaction', () => {
        let recentTransaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            recipient: wallet2.publicKey,
            amount: 30
          });
          blockchain.addBlock({ data: [recentTransaction]});
        });

        it('returns the output amount of the recent transaction', () => {
          expect(
            Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey, timestamp: Date.now()})
          ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
        });

        describe('and there are outputs next to and after the recent transaction', () => {
          let sameBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            recentTransaction = wallet.createTransaction({
              recipient: wallet2.publicKey,
              amount: 60
            });

            sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
            blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction]});
            nextBlockTransaction = new Wallet({ username: 'toto', knownAddresses }).createTransaction({
              recipient: wallet.publicKey,
              amount: 75
            });
            blockchain.addBlock({ data: [nextBlockTransaction]});
          });

          it('includes the output amounts in the returned balance', () => {
            expect(
              Wallet.calculateBalance({ chain: blockchain.chain, address: wallet.publicKey, timestamp: Date.now() })
            ).toEqual(
              recentTransaction.outputMap[wallet.publicKey] +
              sameBlockTransaction.outputMap[wallet.publicKey] +
              nextBlockTransaction.outputMap[wallet.publicKey]
            );
          });
        });
      });
    });
  });
});
