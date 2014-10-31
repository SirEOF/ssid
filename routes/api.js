'use strict';

var express = require('express');
var router = express.Router();

var shitRoutes = require('./shit');
var voteRoutes = require('./vote');
var commentRoutes = require('./comments');

router.use('/api', commentRoutes);
router.use('/api', voteRoutes);
router.use('/api', shitRoutes);

module.exports = router;
