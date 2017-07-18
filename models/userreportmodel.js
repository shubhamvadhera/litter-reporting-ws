var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserReportSchema   = new Schema({
    userid: String,
    submitted: String,
    location: {
        lat: String,
        lng: String
    },
    description: String,
    littertype: String,
    priority: String
},{versionKey : false});

module.exports = mongoose.model('UserReport', UserReportSchema);