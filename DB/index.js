'use strict'
//Set up mongoose connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = dotenv.config();

if (config.error) {
  throw config.error
}

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log("Connexion à la base OK");
});

db.once('disconnected', () => {
  console.error('Successfully disconnected from ' + process.env.DB_URI);
});
