'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Blockchain = require('../blockchain');
const PubSub = require('./pubsub');
const TransactionPool = require('../wallet/transaction-pool');
const authRouter = require('../routes/auth');
const apiRouter = require('../routes/api');
const io = require('./io');
const app = express();
const helmet = require('helmet');
const db = require('../DB');
const passport = require('./passport');

app.locals.addresses = new Map();
app.locals.wallets = new Map();
app.locals.miners = new Map();
app.locals.blockchain = new Blockchain();
app.locals.transactionPool = new TransactionPool();

app.locals.pubsub = new PubSub({
  redisUrl: process.env.REDIS_URL,
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
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.use(passport.initialize());

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.use('*', (req,res) => {
  res.sendFile(path.join(__dirname,'..', 'client', 'dist', 'index.html'));
});

//catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

//error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({ type: 'error', message: err.message });
});

module.exports = app;
