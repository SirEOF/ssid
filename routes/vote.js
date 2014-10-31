var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');

router.post('/shit/:shit_id/upvote', function(req, res, next) {
  

});
