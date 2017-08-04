var express = require('express');
var router = express.Router();
var request = require('request');

var UserReportModel = require('../models/userreportmodel');
var UserDetailsModel = require('../models/userdetailsmodel');

var dataModelURL = 'http://35.192.190.62:5000/categorize';

var mongoose = require('mongoose');

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

//Remove all collections from DB and add dummy data
router.get('/reset', function (req, res, next) {
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
    })
});

module.exports = router;