'use strict';

var express = require('express');
var router = express.Router();
var url = require('url');

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

router.get('/shit/:id', function(req, res, next) {
  Shit.findOne({_id: req.params.id }, function(err, shit){
    if (err) {
      return next(err);
    }

    res.json(shit);
  });
});

router.post('/shit', function(req, res, next) {
  // XXX MUST BE LOGGED IN
  // XXX Check embedded security

  console.log(req.body);
  var s = new Shit(req.body);

  if (s.youtube) {
    var youtubeURL = url.parse(s.youtube, true);
    console.log(youtubeURL);
    if (youtubeURL.query.v) {
      s.youtube = youtubeURL.query.v;
    } else {
      var pathname = youtubeURL.pathname;
      s.youtube = pathname.split('/')[pathname.split('/').length - 1];
    }

    if (s.youtube.indexOf('.') > -1 || s.youtube.indexOf(':') > -1) {
      return next('invalid youtube');
    }

    s.youtube = '//www.youtube.com/embed/' + s.youtube;
  }

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

module.exports = router;
