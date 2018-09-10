'use strict'

logdata.prototype.userlog = {};

function logdata(data) {
    logdata.prototype.userlog =  {};
    var typedata;
    if ((typeof data) === "string") {
        typedata = JSON.parse(data);
    } else {
        typedata = data;
    }    

    logdata.prototype.userlog.name = typedata.name;
    logdata.prototype.userlog.email = typedata.email;

}     

logdata.prototype.getData = function() {
    return logdata.prototype.userlog;
}

module.exports = logdata;