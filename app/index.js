'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Blockchain = require('../blockchain');
const PubSub = require('./pubsub');
const TransactionPool = require('../wallet/transaction-pool');
const apiRouter = require('../routes/api');
const io = require('./io');
const app = express();
const helmet = require('helmet');
const db = require('../DB');

app.locals.addresses = new Set();
app.locals.blockchain = new Blockchain();
app.locals.transactionPool = new TransactionPool();

app.locals.pubsub = new PubSub({
  redisUrl: process.env.REDIS_URL,
  addresses: app.locals.addresses,
  blockchain: app.locals.blockchain,
  transactionPool: app.locals.transactionPool,
  io
});

app.use(helmet({
    contentSecurityPolicy: false
}));
app.disable('x-powered-by');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', '/front/dist')));

app.use('/api', apiRouter);

app.use('*', (req,res) => {
  res.sendFile(path.join(__dirname,'..', 'front', 'dist', 'index.html'));
});

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

module.exports = app;
