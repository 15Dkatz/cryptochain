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
  _id: {
    type: String
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
}, { versionKey: false });


module.exports = {
  Transaction: mongoose.model('transactions', transactionSchema),
  transactionSchema: transactionSchema
}
