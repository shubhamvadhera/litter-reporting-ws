var express = require('express');
var router = express.Router();
var request = require('request');

var UserReportModel = require('../models/userreportmodel');
var UserDetailsModel = require('../models/userdetailsmodel');

var dataModelURL = 'http://35.202.201.178:5000/categorize';

/********** User APIs **********/

//GET user details
router.get('/:userid', function (req, res, next) {
    UserDetailsModel.findById(req.params.userid, function (err, userdetails) {
        if (err || !userdetails)
            res.json({
                status: 404,
                message: 'Error getting user',
                details: err
            }); else {
            res.json(userdetails);
        }
    });
});

//DELETE user
router.delete('/:userid', function (req, res, next) {
    UserDetailsModel.findByIdAndRemove(req.params.userid, function (err, userdetails) {
        if (err || !userdetails)
            res.json({
                status: 500,
                message: 'Error deleting user',
                details: err
            }); else {
            res.json({
                status: 200,
                message: 'User delete successfully'
            });
        }
    });
});

//UPDATE User details
router.put('/:userid', function (req, res, next) {
    UserDetailsModel.findById(req.params.userid, function (err, userdetails) {
        if (err || !userdetails)
            res.json({
                status: 400,
                message: 'Error getting user',
                details: err
            }); else {
            if (req.body.deviceid) userdetails.deviceid = req.body.deviceid;
            if (req.body.email) userdetails.email = req.body.email;
            if (req.body.name) userdetails.name = req.body.name;

            userdetails.save(function (err, saveduser) {
                if (err || !saveduser)
                    res.json({
                        status: 500,
                        message: 'Error updating user details',
                        details: err
                    }); else {
                    res.json({
                        status: 200,
                        message: 'User details updated !',
                        details: saveduser

                    });
                }
            });
        }
    });
});

//POST save the user
router.post('/', function (req, res) {
    var userDetails = new UserDetailsModel();
    if (!req.body.name || !req.body.email || !req.body.deviceid)
        res.json({
            status: 400,
            message: 'Error saving user',
            details: 'One or more mandatory fields are missing'
        }); else {
        userDetails.name = req.body.name;
        userDetails.email = req.body.email;
        userDetails.deviceid = req.body.deviceid;
        userDetails.save(function (err, savedUser) {
            if (err || !savedUser)
                res.json({
                    status: 500,
                    message: 'Error saving user',
                    details: err
                }); else {
                res.json({
                    status: 200,
                    message: 'User details saved !',
                    details: savedUser
                });
            }
        });
    }
});

/********** Report APIs **********/

//GET all reports by status
router.get('/reports/:status', function (req, res, next) {
    var status = req.params.status;
    if (status === 'all') {
        UserReportModel.find({}, function (err, docs) {
            if (err || !docs)
                res.json({
                    status: 404,
                    message: 'Error getting reports',
                    details: err
                }); else {
                res.json(docs);
            }
        });
    } else if (status === 'not-closed') {
        UserReportModel.find(
            {$or: [{status: "open"}, {status: "in-progress"}]}, function (err, docs) {
                if (err || !docs)
                    res.json({
                        status: 404,
                        message: 'Error getting reports',
                        details: err
                    }); else {
                    res.json(docs);
                }
            });
    } else {
        UserReportModel.find({status: status}, function (err, docs) {
            if (err || !docs)
                res.json({
                    status: 404,
                    message: 'Error getting reports',
                    details: err
                }); else {
                res.json(docs);
            }
        });
    }
});

//GET all reports by a user
router.get('/:userid/reports', function (req, res, next) {
    UserReportModel.find({userid: req.params.userid}, function (err, docs) {
        if (err || !docs)
            res.json({
                status: 404,
                message: 'Error getting reports for user',
                details: err
            }); else {
            res.json(docs);
        }
    });
});

// GET the report for the report id
router.get('/report/:reportid', function (req, res, next) {
    UserReportModel.findById(req.params.reportid, function (err, userreport) {
        if (err || !userreport)
            res.json({
                status: 404,
                message: 'Error getting user report',
                details: err
            }); else {
            res.json(userreport);
        }
    });
});

// DELETE the report for the report id
router.delete('/report/:reportid', function (req, res, next) {
    UserReportModel.findByIdAndRemove(req.params.reportid, function (err, userreport) {
        if (err || !userreport)
            res.json({
                status: 404,
                message: 'Error getting user report',
                details: err
            }); else {
            res.json({
                status: 200,
                message: 'User report deleted'
            });
        }
    });
});

//PUT update the report
router.put('/report/:reportid', function (req, res) {
    UserReportModel.findById(req.params.reportid, function (err, userreport) {
        if (err || !userreport)
            res.json({
                status: 404,
                message: 'Error getting user report',
                details: err
            }); else {
            if (req.body.submitted) userreport.submitted = req.body.submitted;
            if (req.body.location) {
                if (req.body.location.lat) userreport.location.lat = req.body.location.lat;
                if (req.body.location.lng) userreport.location.lng = req.body.location.lng;
            }
            if (req.body.address) userreport.address = req.body.address;
            if (req.body.description) userreport.description = req.body.description;
            if (req.body.littertype) userreport.littertype = req.body.littertype;
            if (req.body.priority) userreport.priority = req.body.priority;
            if (req.body.status) userreport.status = req.body.status;
            if (req.body.image) userreport.image = req.body.image;

            userreport.save(function (err, savedReport) {
                if (err || !savedReport)
                    res.json({
                        status: 500,
                        message: 'Error updating report',
                        details: err
                    }); else {
                    res.json({
                        status: 200,
                        message: 'User report updated !',
                        details: savedReport
                    });
                }
            });
        }
    });
});

//POST save the report for a user
router.post('/report', function (req, res) {
    var userReport = new UserReportModel();
    if (!req.body.userid || !req.body.submitted || !req.body.lat || !req.body.lng || !req.body.address || !req.body.priority || !req.body.status || !req.body.image)
        res.json({
            status: 400,
            message: 'Error saving user',
            details: 'One or more mandatory fields are missing'
        }); else {
        userReport.userid = req.body.userid;
        userReport.submitted = req.body.submitted;
        userReport.location.lat = req.body.lat;
        userReport.location.lng = req.body.lng;
        userReport.address = req.body.address;
        userReport.description = req.body.description;
        userReport.priority = req.body.priority;
        userReport.status = req.body.status;
        userReport.image = req.body.image;
        userReport.save(function (err, savedReport) {
            if (err || !savedReport)
                res.json({
                    status: 500,
                    message: 'Error saving report',
                    details: err
                }); else {
                res.json({
                    status: 200,
                    message: 'User report created !',
                    details: savedReport
                });
                // send image for processing to data model and save response litter type in DB
                setLitterTypeFromImage(req.body.image, savedReport._id);
            }
        });
    }
});

//calls the data model to get the catefory and update in DB
function setLitterTypeFromImage(image, reportid) {
    console.log("Image processing request for report: " + reportid);
    request.post({
        url: dataModelURL,
        json: {image: image},
        timeout: 8000
    }, function (error, res, body) {
        if (error || body.status !== 200) {
            console.log("Error getting litter type from data model: ");
            console.log(error);
        } else {
            console.log("Category from image detected - " + body.category);

            //update the report with the category detected
            updateUserReportWithCategory(reportid,body.category);
        }
    });
}

//updates the report in DB with new category
function updateUserReportWithCategory(reportid, category) {
    UserReportModel.findById(reportid, function (err, userreport) {
        if (err || !userreport)
            console.error("Error finding report " + reportid + " Error: " + err);
        else {
            userreport.littertype = category;
            userreport.save(function (err, savedReport) {
                if (err || !savedReport) {
                    console.error("Error saving report " + reportid + " with detected category: " + category + "Error: " + err);
                }
                else {
                    console.log("Report " + reportid + " updated with detected category");
                }
            });
        }
    });
}

module.exports = router;