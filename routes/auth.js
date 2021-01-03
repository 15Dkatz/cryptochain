'use strict';

const crypto = require('crypto');
const os = require('os');
const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const passport = require('../app/passport');
const transporter = require('../app/transporter')
const jwt = require('jsonwebtoken');
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

router.post('/password-forgotten', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(error);
    if (!user) return next(createError(400, 'no user found for this email'));
    const secret = user.password + user.createdAt.getTime();
    const token = jwt.sign({ data: user.email }, secret, { expiresIn: '1h' });
    let mail = {
      from: 'no-reply@cryptochain.org',
      to: user.email,
      subject: 'Cryptochain Reset Password',
      template: 'emailResetPassword',
      context: {
        title: 'Reset Password',
        username: user.username,
        url:  `http://${os.hostname()}:${process.env.PORT}/reset-password/${user._id}/${token}`
      }
    }
    transporter.sendMail(mail, (err, info) => {
      if(err) return next(createError(500, 'cannot send reset password email'));
      return res.json({ type: 'success' })
    });
  });
});

router.post('/reset-password/:id/:token', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if(err) return next(err);
    if(!user) return next(createError(400, 'No user found for id'));
    const secret = user.password + user.createdAt.getTime();
    jwt.verify(req.params.token, secret, (err, decoded) => {
			if(err || decoded.data !== user.email) return next(createError(400, 'Invalid token'));
			user.password = req.body.password;
      user.save((err) => {
        if(err) return next(err);
        res.json({ type: 'success' });
      });
		});
  });
});

module.exports = router;
