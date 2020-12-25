'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BN = require('bn.js');

const convertToString = (val) => {
  return val.toString(16);
};

const convertToBN = (val) => {
  return new BN(val, 16);
};

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
      r: {
        type: String,
        set: convertToString,
        get: convertToBN
      },
      s: {
        type: String,
        set: convertToString,
        get: convertToBN
      },
      recoveryParam: { type: Number }
    }
  },
  outputMap: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });


module.exports = transactionSchema;
