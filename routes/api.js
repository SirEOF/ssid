'use strict';

var express = require('express');
var router = express.Router();

var shitRoutes = require('./shit');

router.use('/api', shitRoutes);

module.exports = router;
