'use strict';

var express = require('express');
var router = express.Router();

var shitRoutes = require('./shit');
var voteRoutes = require('./vote');

router.use('/api', voteRoutes);
router.use('/api', shitRoutes);

module.exports = router;
