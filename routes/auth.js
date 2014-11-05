'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var passport = require('passport');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var express = require('express');
var router = express.Router();

router.get('/auth/me', function(req, res) {
  res.send(req.user || {});
});

router.post('/auth/register', passport.authenticate('local-signup', {
  successRedirect : '/#/', // redirect to the secure profile section
  failureRedirect : '/#/register', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.post('/auth/login', passport.authenticate('local-login', {
  successRedirect : '/#/', // redirect to the secure profile section
  failureRedirect : '/#/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect : '/#/',
    failureRedirect : '/#/register'
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/#/',
    failureRedirect : '/'
}));


router.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// usd to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) {
  console.log('haihai');
  process.nextTick(function() {

    User.findOne({ 'local.email' :  email }, function(err, user) {
      if (err)
        return done(err);

      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {

        var newUser            = new User();

        newUser.local.email    = email;
        newUser.local.password = newUser.generateHash(password);

        newUser.save(function(err) {
          if (err)
            throw err;
            return done(null, newUser);
        });
      }
    });
  });
}));

passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form

  User.findOne({ 'local.email' :  email }, function(err, user) {
    if (err)
      return done(err);

    if (!user)
      return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    if (!user.validPassword(password))
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    return done(null, user);
  });

}));


passport.use(new FacebookStrategy({
  clientID        : process.env.FB_APP_ID,
  clientSecret    : process.env.FB_APP_SECRET,
  callbackURL     : '/auth/facebook/callback'

}, function(token, refreshToken, profile, done) {

  process.nextTick(function() {

    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

      if (err)
        return done(err);

      if (user) {
          return done(null, user); // user found, return that user
      } else {
          var newUser            = new User();

          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          newUser.username = newUser.facebook.name;
          newUser.email = newUser.facebook.email;

          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
      }
      });
    });
}));

passport.use(new TwitterStrategy({
    consumerKey     : process.env.TWITTER_CONSUMER_KEY,
    consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
    callbackURL     : '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {

      User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

        if (err)
          return done(err);

        if (user) {
            return done(null, user); // user found, return that user
        } else {
            var newUser                 = new User();

            newUser.twitter.id          = profile.id;
            newUser.twitter.token       = token;
            newUser.twitter.username    = profile.username;
            newUser.twitter.displayName = profile.displayName;

            newUser.username = newUser.twitter.username;

            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
          }
      });
  });
}));

module.exports = router;
