'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');
var Shit = mongoose.model('Shit');

var async = require('async');

router.post('/shit/:shitId/:voteType', function(req, res, next) {

  if (!req.user) {
    return next('must be logged in');
  }

  if (req.params.voteType !== 'upvote' && req.params.voteType !== 'downvote') {
    return next('Not a valid vote type');
  }

  async.auto({
    shit: function(next){
      Shit.findOne({_id: req.params.shitId}, function(err, shit) {
        if (err) {
          return next(err);
        }

        if (!shit) {
          return next('Not a valid shit');
        }

        return next(err, shit);
      });
    },

    previousVote: function(next) {
      Vote.findOne({shit: req.params.shitId, user: req.user._id}, next);
    },

    vote: ['shit', 'previousVote', function(next, results) {
      var previous = results.previousVote;

      if (previous) {
        return next('already voted');
      }

      var v = new Vote({
        shit: req.params.shitId,
        voteType: req.params.voteType,
        user: req.user._id
      });

      v.save(next);
    }],

    updateShit: ['shit', 'vote', 'previousVote', function(next) {
      if (req.params.voteType === 'upvote') {
        Shit.findByIdAndUpdate(req.params.shitId, {$inc: { up: 1, score: 1 }}, next);
      } else if (req.params.voteType === 'downvote') {
        Shit.findByIdAndUpdate(req.params.shitId, {$inc: { down: 1, score: -1 }}, next);
      } else {
        return next('not a valid vote type, up or down only');
      }
    }]

  }, function(err, results) {
    if (err) {
      return next(err);
    }

    return res.json(results.updateShit);
  });

});

module.exports = router;
