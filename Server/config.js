exports.Database = class Database {
   static host = 'localhost'
   static db = 'messenger'
   static user = 'root'
}

exports.routes = {
    login : "/login",
    register : "/register",
    otp : "/otp",
    profile : {//all get
        getMy : '/myprofile',
        get : '/profile/:id',
        update : '/updateprofile',
    },
    social : {//all get
        search : '/social/search/:name/:start/:count',
        network : '/social/network/:type/:start/:count',
        requests : '/social/requests',
        send : '/social/send',
        revoke : '/social/revoke',
        respond : '/social/respond',// /social/respond/someone123/1(yes)|0(no)
        remove: '/social/remove', // /social/delete/1(block)|0(delete)/123MU123
        getStatus : '/social/status/:id'
    },
    thirdParty : {
        authorize : '/thirdparty',
        google : 'https://www.googleapis.com/gmail/v1/users/me/profile'
    },
    logout : '/logout'
}

exports.validFields = {
    "/register" : ['identity'],
    "/otp" : ["identity", "otp"],
    "/login" : ['identity'],
    "/search" : ['identity'],
    '/updateprofile' : ['name']
}

exports.errorCodes = class ErrorCodes {
    static error_1 = 'Missing fields';
}

exports.utils = class Utils{
    static min_name_length = 5;
}

exports.regex = class Regex{
    static email = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    static name = /^[a-zA-Z ]+$/;
}
