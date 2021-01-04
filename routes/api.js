'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const Wallet = require('../wallet');
const Miner = require('../miner');
const Address = require('../DB/models/addresses');
const { Transaction } = require('../DB/models/transactions');
const passport = require('../app/passport');
const transporter = require('../app/transporter');

router.get('/blocks', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json( req.app.locals.blockchain.chain );
});

router.get('/blocks/length', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json(req.app.locals.blockchain.chain.length);
});

router.get('/blocks/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
  const { id } = req.params,
  { length } = req.app.locals.blockchain.chain,
  blocksReversed = req.app.locals.blockchain.chain.slice().reverse();

  let startIndex = (id-1) * 5,
  endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

router.post('/transact', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  const { amount, recipient } = req.body;
  const id = req.user._id.toString();
  const wallet = req.app.locals.wallets.get(id);
  let transaction = req.app.locals.transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if(transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
      Transaction.findById(transaction._id, (err, doc) => {
        if(err) return next(err);
        console.log(doc);
        doc.input  = transaction.input;
        doc.outputMap = transaction.outputMap;
        doc.save();
      });
    } else {
      transaction = wallet.createTransaction({ recipient, amount , chain: req.app.locals.blockchain.chain });
      const doc = new Transaction({ _id: transaction._id, input: transaction.input, outputMap: transaction.outputMap });
      doc.save();
    }
  } catch(err) {
    console.log(err);
    return next(createError(400));
  }

  req.app.locals.pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

router.get('/transaction-pool-map', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json(req.app.locals.transactionPool.transactionMap);
});

router.get('/mine-transactions', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  const id = req.user._id.toString();
  const wallet = req.app.locals.wallets.get(id);
  const miner = req.app.locals.miners.get(wallet.publicKey)
  try {
    miner.mineTransactions();
  } catch(err) {
    return next(createError(400));
  }
  res.json({ type: 'success' });
});

router.get('/wallet-info', passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = req.user._id.toString();
  const wallet = req.app.locals.wallets.get(id);

  res.json({
    address: wallet.publicKey,
    balance: Wallet.calculateBalance({ chain: req.app.locals.blockchain.chain, address: wallet.publicKey, timestamp: Date.now() })
  });
});

router.get('/known-addresses', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json(Array.from(Wallet.knownAddresses));
});

router.get('/download', (req, res, next) => {
  fs.writeFile(path.join(__dirname,'..', 'blockchain-file.json'), JSON.stringify(req.app.locals.blockchain.chain, null, ' '), (err) => {
    if (err) return next(err);
    res.download(path.join(__dirname,'..', 'blockchain-file.json'));
  });
});

router.post('/create-wallet', passport.authenticate('bearer', { session: false }), (req, res) => {
  const { privateKey } = req.body;
  const id = req.user._id.toString();
  let wallet;
  if(privateKey) {
    req.app.locals.wallets.set(id, new Wallet({ username: req.user.username, privateKey, chain: req.app.locals.blockchain.chain }));
    wallet = req.app.locals.wallets.get(id);
  } else {
    req.app.locals.wallets.set(id, new Wallet({ username: req.user.username }));
    wallet = req.app.locals.wallets.get(id);

    req.app.locals.pubsub.broadcastAddresses();

    const address = new Address({
      user: req.user._id,
      key: wallet.publicKey
    });
    address.save();

    let mail = {
      from: 'no-reply@cryptochain.org',
      to: req.user.email,
      subject: 'Cryptochain Private Key',
      template: 'emailPrivateKey',
      context: {
        title: 'Private Key',
        username: req.user.username,
        key: wallet.keyPair.getPrivate('hex')
      }
    }
    transporter.sendMail(mail, (err, info) => {
      if(err) console.error(err);
    });
  }

  res.json({ type: 'success', address: wallet.publicKey, balance: wallet.balance });
});

router.post('/create-miner', passport.authenticate('bearer', { session: false }), (req, res) => {

  const id = req.user._id.toString();
  const wallet = req.app.locals.wallets.get(id);

  if(!wallet) return next(createError(400, 'You must create wallet first'));

  req.app.locals.miners.set(req.app.locals.wallets.get(id).publicKey, new Miner({
    blockchain: req.app.locals.blockchain,
    transactionPool: req.app.locals.transactionPool,
    wallet: wallet,
    pubsub: req.app. locals.pubsub
  }));

  res.json({ type: 'success', miner: wallet.publicKey });
});

module.exports = router;
