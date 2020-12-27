'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

const TokenSchema = new Schema({
  jwt: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

TokenSchema.plugin(timestamps);

TokenSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model('token', TokenSchema);
