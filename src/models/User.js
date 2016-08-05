var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  lobby: {type: Boolean, default: true},
  token: String,
  lastseen: {type: Date, default: Date.now()}
})

module.exports = mongoose.model('User', UserSchema);
