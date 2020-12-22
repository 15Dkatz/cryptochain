'use strict';

const express = require('express');
const router = express.Router();
const Wallet = require('../wallet');
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

router.get('/blocks', (req, res) => {
  res.json( req.app.locals.blockchain.chain );
});

router.get('/blocks/length', (req, res) => {
  res.json(req.app.locals.blockchain.chain.length);
});

router.get('/blocks/:id', (req, res) => {
  const { id } = req.params,
  { length } = req.app.locals.blockchain.chain,
  blocksReversed = req.app.locals.blockchain.chain.slice().reverse();

  let startIndex = (id-1) * 5,
  endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

router.post('/mine', (req, res) => {
  const { data } = req.body;
  req.app.locals.blockchain.addBlock({ data });
  req.app.locals.pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

router.post('/transact', (req, res, next) => {
  const { amount, recipient } = req.body;
  let transaction = req.app.locals.transactionPool.existingTransaction({ inputAddress: req.app.locals.wallet.publicKey });

  try {
    if(transaction) {
      transaction.update({ senderWallet: req.app.locals.wallet, recipient, amount });
    } else {
      transaction = req.app.locals.wallet.createTransaction({ recipient, amount , chain: req.app.locals.blockchain.chain });
    }
  } catch(err) {
    return next(createError(400, err.message));
  }

  req.app.locals.transactionPool.setTransaction(transaction);
  req.app.locals.pubsub.broadcastTransaction(transaction);

  res.json({ type: 'success', transaction });
});

router.get('/transaction-pool-map', (req, res) => {
  res.json(req.app.locals.transactionPool.transactionMap);
});

router.get('/mine-transactions', (req, res, next) => {
  try {
    res.app.locals.miner.mineTransactions();
  } catch(err) {
    return next(createError(400, err.message));
  }
  res.redirect('/api/blocks');
});

router.get('/wallet-info', (req, res) => {
  const address = req.app.locals.wallet.publicKey;
  res.json({
    address: address,
    balance: Wallet.calculateBalance({ chain: req.app.locals.blockchain.chain, address, timestamp: Date.now() })
  });
});

router.get('/known-addresses', (req, res) => {
  res.json(Array.from(req.app.locals.addresses));
});

module.exports = router;
