var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserDetailsSchema   = new Schema({
    name: String,
    email: String,
    deviceid: String
},{versionKey : false});

module.exports = mongoose.model('UserDetails', UserDetailsSchema);