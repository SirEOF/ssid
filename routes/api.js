'use strict';

var express = require('express');
var router = express.Router();

var shitRoutes = require('./shit');
var voteRoutes = require('./vote');
var commentRoutes = require('./comments');
var awsRoutes = require('./aws');
var userRoutes = require('./user');

var authRoutes = require('./auth');

router.use('/api', commentRoutes);
router.use('/api', voteRoutes);
router.use('/api', shitRoutes);
router.use('/api', userRoutes);

router.use('/', authRoutes);
router.use('/', awsRoutes);


module.exports = router;
