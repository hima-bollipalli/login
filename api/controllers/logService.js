'use strict';
//for checking
//see the changes
var userlog = require('../domain/log');
var Logger = require('bunyan');
var validator = require('node-validator');
var isemail = require("isemail");

var log = new Logger.createLogger({
    name: 'log-errors',
    streams: [
        {  level: 'info',
            stream: process.stdout
    },
    {
        level: 'error',
        path: '/my-error.log'
    }],
    serializers: { req: Logger.stdSerializers.req }
});
module.exports = {
    createUser: createUser,
    getDetails: getDetails,
    getDetailsById: getDetailsById,
   updateDetails: updateDetails,
  deleteDetails: deleteDetails,

};
function createUser(req, res) {
   
    var check=validator.isObject()
    .withRequired('name',validator.isString({message:"Please enter name"}))
    .withRequired('email',validator.isString({message:"please enter email"}));
    var toValidate=req.swagger.params.body.value;
    console.log(req.swagger.params.body.value);
    var email=req.swagger.params.body.value.email;
    console.log(email);
    var r = isemail.validate(email);
    console.log(r);
    if(r === true){
    validator.run(check, toValidate, function(errorCount, errors) {
        if (errorCount == 0) {
    (new userlog(req.swagger.params.body.value)).save(function(err, content) {
        if (err) {
            var response = { "status": "400", "error": err }
            res.json(response);
            log.error("Error : %s", JSON.stringify(err));
        } else {                      
            log.error("create user called...");
            var response = {};
            response.status = 200;
            response.data = {};
            response.data.message = content.message || "user created successfully";
            res.json(response);
        }
    });
    } else {
        var response = { "status": "400", "error": errors }
        res.json(response);
    }
    });} else {
        res.json("invalid useremail");
        console.log("error");
    }
};

function getDetailsById(req, res) { 
     console.log(req.swagger.params.uId.value);
     var check=validator.isObject().withRequired('uId',validator.isString({message: "Enter valid user id"} ))
     validator.run(check,{"uId": req.swagger.params.uId.value},function(errcount,errors) {
    
        if(errcount==0){
            (new userlog()).DetailsById(req.swagger.params.uId.value,
                function(err, content) {
                                        console.log(content.data);
                    if (err) {
                        var response = { "status": "400", "error": err }
                        res.json(response);
                       
                    } else if (content.data && content.data.length > 0) {
                        var resObj = { "status": "200", "data": content.data }
                        console.log(resObj)
                        res.json(resObj);
                    } else {
                        var resObj = { "status": "200", "data": { "message": " details not found" } }
                        res.json(resObj);
                    }
                    
                });
        }
           
    })
}

function getDetails(req,res) {
 
    var limit = req.limit ? req.limit : 10;
    var page = req.page ? req.page : 1
    var skip = (page - 1) * limit;
    (new userlog()).findAll(
        function(err, content) {
            console.log('content==>',content)
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
            } else if (content.data && content.data.length > 0) {
                var resObj = { "status": "200", "data": content.data }
                res.json(resObj);
            } else {
                var resObj = { "status": "200", "data": { "message": "no Details found" } }
                res.json(resObj);
            }
        });
}

function updateDetails(req, res) {  
    (new userlog(req.swagger.params.body.value)).updateDetails(req.swagger.params.uId.value,
        function(err, content) {
            if (err) {
                var response = { "status": "400", "error": err }
                res.json(response);
             }
            res.set('Content-user', 'application/json');
            var resObj = {};
            resObj.status = 200;
            resObj.data = {}
            resObj.data.message = content.message || "updated successfully";
            res.json(resObj);
        });           
};
function deleteDetails(req, res) {
    var eId = req.swagger.params.uId.value;
   
    (new userlog()).deleteDetails(req.swagger.params.uId.value,
        function(err, content) {
            if (err) {
                
                var response = { "status": "400", "error": err }
                res.json(response);
               
            } else if (content) {
                 res.set('Content-user', 'application/json');
                var resObj = {};
                resObj.status = 200;
                resObj.data = {};
                resObj.data.message = content.message || "deleted successfully";
                res.json(resObj);
            } 
            
        });
}