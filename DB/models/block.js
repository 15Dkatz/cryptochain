'use strict';

const Block = require('../../blockchain/block');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  timestamp: Number,
  lastHash: String,
  hash: String,
  data: Schema.Types.Mixed,
  nonce: Number,
  difficulty: Number
});

module.exports = mongoose.model('block', blockSchema);
