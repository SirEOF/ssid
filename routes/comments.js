'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var Shit = mongoose.model('Shit');

var async = require('async');

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
      Comment.find({shit: req.params.shitId}, next);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    console.log(results.comments);
    res.json(results.comments);
  });
});

router.post('/shit/:shitId/comment', function(req, res, next) {
  // is valid shit?

  var c = new Comment({
    shit: req.params.shitId,
    body: req.body.body
  });

  c.save(function(err, comment) {
    if (err) {
      return next(err);
    }

    res.send(comment);
  });
});

module.exports = router;
