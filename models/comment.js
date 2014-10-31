var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  shit: {type: Schema.Types.ObjectId, ref: 'Shit' },
  user: {type: Schema.Types.ObjectId, ref: 'User' },
  ts: {type: Date, default: Date.now },
  body: String
});

module.exports = mongoose.model('Comment', CommentSchema);
