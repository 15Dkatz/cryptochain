'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  input: {
    timestamp: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
    },
    address: {
      type: String,
      required: true
    },
    signature: {
      r: { type: String },
      s: { type: String },
      recoveryParam: { type: Number }
    }
  },
  outputMap: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

module.exports = transactionSchema;
