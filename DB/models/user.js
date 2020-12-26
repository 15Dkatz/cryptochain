'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var timestamps = require('mongoose-timestamp');

const SALT_WORK_FACTOR = 10;
const ROLE = ['admin', 'user'];

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ROLE,
    required: true,
    default: 'user'
  }
});

UserSchema.plugin(timestamps);

UserSchema.pre('save', (next) => {
  // only hash the password if it has been modified (or is new)
  if(!this.isModified('password')) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if(err) return next(err);
    bcrypt.hash(this.password, salt, (error, hash) => {
      if(error) return next(error);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);
