'use strict';

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/user/me', function(req, res) {
  res.send(req.user || {});
});

module.exports = router;
