'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Shit = mongoose.model('Shit');

router.get('/shit', function (req, res, next) {
  // XXX Pagination
  Shit.find().sort({ts : -1}).exec(function(err, shits) {
    if (err) {
      return next(err);
    }

    res.json(shits);
  });
});

router.get('/shit/new', function (req, res, next) {
  // XXX Pagination
  Shit.find().sort({ts : -1}).exec(function(err, shits) {
    if (err) {
      return next(err);
    }

    res.json(shits);
  });
});


router.get('/shit/top', function (req, res, next) {
  // XXX Pagination
  Shit.find().sort({score : -1}).exec(function(err, shits) {
    if (err) {
      return next(err);
    }
    res.json(shits);
  });
});


router.get('/shit/controversial', function (req, res, next) {
  // XXX Pagination
  Shit.find().sort({up:1, down: 1}).exec(function(err, shits) {
    if (err) {
      return next(err);
    }

    res.json(shits);
  });
});

router.post('/shit', function(req, res, next) {
  // XXX MUST BE LOGGED IN

  console.log(req.body);

  var s = new Shit(req.body);
  if (!s.body && !s.title && !s.img && !s.youtube && !s.vine) {
    return next('shit needs content');
  }
  s.save(function(err) {
    if (err) {
      return next(err);
    }

    return res.send('Okay');
  });
});

router.post('/shit/:shit_id/upvote', function(req, res, next) {

});

module.exports = router;
