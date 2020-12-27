'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../DB/models/user');
const Token = require('../DB/models/token');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if(err) return done(err);
    if(!user) return done(null, false, { message: 'User not found'});
    if(!user.validPassword(password)) return done(null, false, { message: 'Invalid password'});
    return done(null, user);
  });
}));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {

  User.findOne({ $or: [{ email }, { username: req.body.username }]}, (err, user) => {
    if(err) return done(err);
    if(user) return done(null, false, { message: 'An account with this email or username already exist'});
    const newUser = new User({
      username: req.body.username,
      password,
      email
    });
    newUser.save((err) => {
      console.log(err);
      if(err) return done(null, false, { message: 'User validation Error'});
      return done(null, newUser);
    });
  });
}));

passport.use('bearer', new BearerStrategy((token, done) => {
  Token.findOne({ jwt: token }).populate('user').exec((err, token) => {
    if (err) return done(err);
    if (!token.user) return done(null, false);
    return done(null, token.user, { scope: 'all' });
  });
}));

module.exports = passport;
