'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const Wallet = require('../wallet');
const Miner = require('../miner');
const Address = require('../DB/models/address');
const passport = require('../app/passport');

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
  let transaction = req.app.locals.transactionPool.existingTransaction({ inputAddress: req.app.locals.wallet.publicKey });

  try {
    if(transaction) {
      transaction.update({ senderWallet: req.app.locals.wallet, recipient, amount });
    } else {
      transaction = req.app.locals.wallet.createTransaction({ recipient, amount , chain: req.app.locals.blockchain.chain });
    }
  } catch(err) {
    return next(err);
  }

  req.app.locals.transactionPool.setTransaction(transaction);
  req.app.locals.pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

router.get('/transaction-pool-map', (req, res) => {
  res.json(req.app.locals.transactionPool.transactionMap);
});

router.get('/mine-transactions', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  try {
    req.app.locals.miner.mineTransactions();
  } catch(err) {
    return next(err);
  }
  res.redirect('/api/blocks');
});

router.get('/wallet-info', passport.authenticate('bearer', { session: false }), (req, res) => {
  const address = req.app.locals.wallet.publicKey;
  res.json({
    address: address,
    balance: Wallet.calculateBalance({ chain: req.app.locals.blockchain.chain, address, timestamp: Date.now() })
  });
});

router.get('/known-addresses', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.json(Array.from(req.app.locals.addresses));
});

router.get('/download', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  fs.writeFile(path.join(__dirname,'..', 'blockchain-file.json'), JSON.stringify(req.app.locals.blockchain.chain, null, ' '), (err) => {
    if (err) return next(err);
    res.download(path.join(__dirname,'..', 'blockchain-file.json'));
  });
});

router.post('/create-wallet-and-miner', passport.authenticate('bearer', { session: false }), (req, res) => {
  const { privateKey } = req.body;

  if(privateKey) {
    req.app.locals.wallet = new Wallet({ username: req.user.username, privateKey, knownAddresses: req.app.locals.addresses});
  } else {
    req.app.locals.wallet = new Wallet({ username: req.user.username, knownAddresses: req.app.locals.addresses});
  }
  req.app.locals.pubsub.broadcastAddresses();

  const address = new Address({
    username: req.user.username,
    key: req.app.locals.wallet.publicKey
  });
  address.save();

  req.app.locals.miner = new Miner({
    blockchain: req.app.locals.blockchain,
    transactionPool: req.app.locals.transactionPool,
    wallet: req.app.locals.wallet,
    pubsub: req.app. locals.pubsub
  });

  res.json({ type: 'success', wallet: req.app.locals.wallet.publicKey, balance: req.app.locals.wallet.balance });
});

router.get('/private-key', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  if(req.app.locals.wallet) {
    return res.json({ type: 'success', privateKey: req.app.locals.wallet.getPrivateKey()})
  }
  next(createError(400, 'wallet still not created'));
});

module.exports = router;
