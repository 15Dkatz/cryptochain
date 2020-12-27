'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('address', AddressSchema);
