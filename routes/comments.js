'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Shit = mongoose.model('Shit');

var async = require('async');


router.get('/comment/mine', function(req, res, next) {
  if (!req.user) {
    return next('must be logged in');
  }

  Comment.find({user: req.user.id}).populate('shit').exec(function(err, comments) {
    if (err) {
      return next(err);
    }

    return res.json(comments);
  });
});

router.get('/shit/:shitId/comment', function(req, res, next){
  async.auto({
    shit: function(next) {
      Shit.findOne({_id: req.params.shitId}, function(err, shit) {
        if (err) {
          return next(err);
        }

        if (!shit) {
          return next('not a valid shit');
        }

        return next(err, shit);
      });
    },

    comments: function(next) {
      Comment.find({shit: req.params.shitId}).populate('user').exec(next);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results.comments);
  });
});

router.post('/shit/:shitId/comment', function(req, res, next) {

  if (!req.user) {
    return next('must be logged in');
  }
  // is valid shit?

  var c = new Comment({
    shit: req.params.shitId,
    body: req.body.body,
    user: req.user._id
  });

  c.save(function(err, comment) {
    if (err) {
      return next(err);
    }

    res.send(comment);
  });
});

module.exports = router;
