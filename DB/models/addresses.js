'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('addresses', AddressSchema);
