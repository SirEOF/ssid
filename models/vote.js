'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteTypes = 'upvote downvote'.split(' ');

var VoteSchema = new Schema({
  voteType: {type: String, enum: voteTypes },
  ts: { type: Date, default: Date.now },

  user: { type: Schema.Types.ObjectId, ref: 'User' },
  shit: { type: Schema.Types.ObjectId, ref: 'Shit' }
});

module.exports = mongoose.model('Vote', VoteSchema);
