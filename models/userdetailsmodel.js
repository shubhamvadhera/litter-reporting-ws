var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserDetailsSchema   = new Schema({
    firstname: String,
    lastname: String,
    mobile: String,
    email: String
},{versionKey : false});

module.exports = mongoose.model('UserDetails', UserDetailsSchema);