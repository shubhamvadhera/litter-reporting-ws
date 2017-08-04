var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var UserReportModel = require('../models/userreportmodel');
// var UserDetailsModel = require('../models/userdetailsmodel');

// var dataModelURL = 'http://35.192.190.62:5000/categorize';

//For generating dummy data in DB
var MAX_LAT = 122;
var MIN_LAT = 118;
var MAX_LON = 38;
var MIN_LON = 36;

var dummyImageBase64 = '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'

    /********** APIs to be used by developers / system admin only **********/

//Remove all collections from DB
router.get('/empty', function (req, res, next) {
    removeAllDBCollections(function (err) {
        if(err)
        res.json({
            status: 500,
            message: 'Error emptying the DB',
            details: err
        });
        else
        res.json({
            status: 200,
            message: 'All DB collections deleted',
            details: ''
        });

    });
});

function removeAllDBCollections(callback) {
    mongoose.connection.db.dropCollection('userdetails', function (err, result) {
        if (err && err.code !== 26)
            callback(err);
        else {
            mongoose.connection.db.dropCollection('userreports', function (err, result) {
                if (err && err.code !== 26)
                    callback(err);
                else {
                    callback(null);
                }
            });
        }
    });
}

//Remove all collections from DB and add dummy reports
router.get('/reset/:count', function (req, res, next) {
    removeAllDBCollections(function (err) {
        if(err)
            res.json({
                status: 500,
                message: 'Error emptying the DB',
                details: err
            });
        else
            populateDummyData(req.params.count,function () {
                res.json({
                    status: 200,
                    message: 'Database reset successful !',
                    details: 'Inserted '+req.params.count+' records'
                });
            });
    })
});

function populateDummyData(numofrecords, callback) {
    var curr_date = getCurrentDate();
    for(var i=0; i<numofrecords; ++i) {
        var count = 0;
        setTimeout(function() {
            insertOneDummyRecord(++count, curr_date);
        },100);
    }
    callback();
}

function insertOneDummyRecord(i, curr_date) {
    var userReport = new UserReportModel();
    console.log('Inserting ' + i + 'th record');
    userReport.userid = 'user' + i;
    userReport.submitted = curr_date;
    userReport.location.lat = Math.random() * (MAX_LAT - MIN_LAT) + MIN_LAT;
    userReport.location.lng = Math.random() * (MAX_LON - MIN_LON) + MIN_LON;
    userReport.address = 'user address' + i;
    userReport.description = 'litter';
    userReport.priority = 'low';
    userReport.status = 'open';
    userReport.image = dummyImageBase64;
    userReport.save(function (err, savedReport) {
    });
}

//function credits: https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10)
        dd = '0'+dd
    if(mm<10)
        mm = '0'+mm
    today = mm + '/' + dd + '/' + yyyy;
    return today
}

module.exports = router;