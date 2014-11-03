var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShitSchema = new Schema({
  title: String,
  body: String,
  img: String,

  youtube: String,
  vine: String,

  user: {type: Schema.Types.ObjectId, ref: 'User'},

  ts: {type: Date, default: Date.now},
  up: {type: Number, default: 0},
  down: {type: Number, default: 0},
  score: {type: Number, default: 0}
});

module.exports = mongoose.model('Shit', ShitSchema);
