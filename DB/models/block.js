'use strict';

const Block = require('../../blockchain/block');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  timestamp: {
    type: Number,
    required: true,
    unique: true
  },
  lastHash: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  nonce: {
    type: Number,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('block', blockSchema);
