'use strict';

const express = require('express');
const router = express.Router();
const passport = require('../app/passport');
const crypto = require('crypto');
const User = require('../DB/models/user');
const Token = require('../DB/models/token');

router.post('/signin', passport.authenticate('local-signin', { session: false }), (req, res, next) => {
  Token.findOne({ user: req.user._id }).exec((err, token) => {
    if(err) return next(err);
    if(token) {
      token.updatedAt = new Date();
      return token.save((error) => {
        if(error) return next(error);
        res.json({ type: 'success', username: req.user.username, jwt: token.jwt });
      });
    }
    crypto.randomBytes(64, (err, buffer) => {
      const jwt = buffer.toString('hex');
      const token = new Token({ jwt, user: req.user._id });
      token.save((error) => {
        if(error) return next(error);
        res.json({ type: 'success', username: req.user.username, jwt: jwt });
      });
    });
  });
});

router.post('/signup', passport.authenticate('local-signup', { session: false }), (req, res) => {
  res.json({ type: 'success', id: req.user.id, username: req.user.username });
});

router.post('/logout', passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = req.user._id.toString()
  req.app.locals.miners.delete(req.app.locals.wallets.get(req.user._id));
  req.app.locals.wallets.delete(req.user._id);
  Token.findOneAndDelete({ user: req.user._id }, (err, token) => {
    if(err) return next(err);
    res.json({ type: 'success', message: 'Log out' });
  });
});

module.exports = router;
