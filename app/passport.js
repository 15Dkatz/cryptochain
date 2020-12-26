'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../DB/models/user');

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
    if(password !== req.body.confirm) return done(null, false, { message: 'Passwords must match'});
    const newUser = new User({
      username: req.body.username,
      password,
      email
    });
    newUser.save((err) => {
      if(err) return done(null, false, { message: 'User validation Error'});
      return done(null, newUser);
    });
  });
}));

module.exports = passport;
