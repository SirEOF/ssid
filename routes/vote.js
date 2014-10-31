'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');
var Shit = mongoose.model('Shit');

var async = require('async');

router.post('/shit/:shitId/:voteType', function(req, res, next) {
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

    // previousVote: function(next) {
    //   // CHECK FOR USER...
    //   Vote.findOne({shit: req.params.shit_id})
    // }

    vote: ['shit', function(next) {
      var v = new Vote({
        shit: req.params.shitId,
        voteType: req.params.voteType
      });

      v.save(next);
    }],

    updateShit: ['shit', function(next) {
      if (req.params.voteType === 'upvote') {
        Shit.findByIdAndUpdate(req.params.shitId, {$inc: { up: 1, score: 1 }}, next);
      } else if (req.params.voteType === 'downvote') {
        Shit.findByIdAndUpdate(req.params.shitId, {$inc: { up: -1, score: -1 }}, next);
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
