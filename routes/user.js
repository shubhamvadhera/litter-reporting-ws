var express = require('express');
var router = express.Router();
var UserReportModel = require('../models/userreportmodel');
var UserDetailsModel = require('../models/userdetailsmodel')

//GET user details
router.get('/:userid', function(req, res, next) {
    UserDetailsModel.findById(req.params.userid, function(err, userdetails) {
        if (err || !userdetails)
            res.json({
                message: 'Error getting user',
                details: err
            }); else {
            res.json(userdetails);
        }
    });
});

//POST save the user
router.post('/', function(req, res) {
    var userDetails = new UserDetailsModel();
    if(!req.body.firstname || !req.body.lastname || !req.body.mobile || !req.body.email)
        res.json({
            message: 'Error saving user',
            details: 'firstname, lastname, mobile or email is missing'
        }); else {
        userDetails.firstname = req.body.firstname;
        userDetails.lastname = req.body.lastname;
        userDetails.mobile = req.body.mobile;
        userDetails.email = req.body.email;
        userDetails.save(function(err, savedUser) {
            if (err || !savedUser)
                res.json({
                    message: 'Error saving user',
                    details: err
                }); else {
                res.json({
                    message: 'User details saved !',
                    details: savedUser
                });
            }
        });
    }
});

// GET the report for the report id
router.get('/report/:reportid', function(req, res, next) {
    UserReportModel.findById(req.params.reportid, function(err, userreport) {
        if (err || !userreport)
            res.json({
                message: 'Error getting user report',
                details: err
            }); else {
            res.json(userreport);
        }
    });
});

//POST save the report for a user
router.post('/report/', function(req, res) {
    var userReport = new UserReportModel();
    userReport.userid = req.body.userid;
    userReport.submitted = req.body.submitted;
    userReport.location.lat = req.body.location.lat;
    userReport.location.lng = req.body.location.lng;
    userReport.description = req.body.description;
    userReport.littertype = req.body.littertype;
    userReport.priority = req.body.priority;

    userReport.save(function(err, savedReport) {
        if (err || !savedReport)
            res.json({
                message: 'Error saving report',
                details: err
            }); else {
            res.json({
                message: 'User report created !',
                details: savedReport
            });
        }
    });
});

module.exports = router;