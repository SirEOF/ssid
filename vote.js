'use strict';

var mongoose = require('mognoose');
var Schema = mongoose.Schema;

var voteTypes = 'upvote downvote'.split(' ');

var VoteSchema = new Schema({
  voteType: {type: String, enum: voteTypes },
  ts: { type: Date, default: Date.now },
  user: { type: String}
});

module.exports = mongoose.model('Vote', VoteSchema);
