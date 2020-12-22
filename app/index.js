'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
// var cookieParser = require('cookie-parser');
const logger = require('morgan');
const Blockchain = require('../blockchain');
const PubSub = require('./pubsub');
const TransactionPool = require('../wallet/transaction-pool');
const Wallet = require('../wallet');
const Miner = require('../miner');
const apiRouter = require('../routes/api');
const io = require('./io');
const app = express();

app.locals.addresses = new Set();
app.locals.blockchain = new Blockchain();
app.locals.transactionPool = new TransactionPool();
app.locals.wallet = new Wallet({ knownAddresses: app.locals.addresses });

app.locals.pubsub = new PubSub({
  addresses: app.locals.addresses,
  blockchain: app.locals.blockchain,
  transactionPool: app.locals.transactionPool,
  io
});

app.locals.miner = new Miner({
  blockchain: app.locals.blockchain,
  transactionPool: app.locals.transactionPool,
  wallet: app.locals.wallet,
  pubsub: app.locals.pubsub
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', '/front/dist')));

app.use('/api', apiRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({ type: 'error', message: err.message });
});

if (app.get('env') === "development") {
	const wallet1 = new Wallet({ knownAddresses: app.locals.addresses }),
	wallet2 = new Wallet({ knownAddresses: app.locals.addresses });

	const generateWalletTransaction = ({ wallet, recipient, amount }) => {
		const transaction = wallet.createTransaction({
			recipient, amount, chain: app.locals.blockchain.chain
		});

		app.locals.transactionPool.setTransaction(transaction);
	};

	const walletAction = () => generateWalletTransaction({
		wallet: app.locals.wallet, recipient: wallet1.publicKey, amount: 5
	});

	const wallet1Action = () => generateWalletTransaction({
		wallet: wallet1, recipient: wallet2.publicKey, amount: 10
	});

	const wallet2Action = () => generateWalletTransaction({
		wallet: wallet2, recipient: app.locals.wallet.publicKey, amount: 15
	});


	for ( let i=0; i < 30 ; i++) {
		if (i%3 === 0) {
			walletAction();
			wallet1Action();
		} else if (i%3 === 1) {
			walletAction();
			wallet2Action();
		} else {
			wallet1Action();
			wallet2Action();
		}
		app.locals.miner.mineTransactions();
	}
}

module.exports = app;
