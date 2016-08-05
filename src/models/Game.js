var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
  p1: {type: Schema.Types.ObjectId, ref: 'User'},
  p2: {type: Schema.Types.ObjectId, ref: 'User'},
  created: {type: Date, default: Date.now() },
  update: {type: Date, default: Date.now() },
  gamestate: Object,
  status: String,
  currentPlayer: {type: Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model('Game', GameSchema);
