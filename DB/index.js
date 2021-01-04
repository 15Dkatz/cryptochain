'use strict'
//Set up mongoose connection
const mongoose = require('mongoose');
const { GENESIS_DATA } = require('../config');
const Block = require('./models/blocks');

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log("Connexion à la base OK");
  Block.estimatedDocumentCount((err, count) => {
    if(err) throw err;
    if( count < 1) {
      const genesis = new Block(GENESIS_DATA);
      genesis.save();
    }
  });
});

db.once('disconnected', () => {
  console.error('Successfully disconnected from ' + process.env.DB_URI);
});

module.exports = db;
