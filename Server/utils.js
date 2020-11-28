const uuid = require('uuid');
const validator = require('validator');
module.exports.getRandomNumber  = (min, max) => { return Math.floor(Math.random() * (max - min) + min) };
module.exports.ALPHABETS_LOWER  = "abcdefghijklmnopqrstuvwxyz"
module.exports.OTP_SUBJECT      = "OTP FOR MESSENGER";
module.exports.OTP_MESSAGE      = otp => `Your one time password is : ${otp}`
module.exports.OTP_HTML         = otp =>`<h3>${this.OTP_MESSAGE(otp)}</h3>`;
module.exports.OWNER_EMAIL      = process.env.OWNER_EMAIL;
module.exports.AUTHENTICATE_GET_ACCESS = ['web', 'mobile', 'api']


module.exports.SUCCESS          = 200
module.exports.CREATED          = 201
module.exports.BAD_REQUEST      = 400
module.exports.ACCESS_DENIED    = 401
module.exports.FORBIDDEN        = 403
module.exports.NOT_FOUND        = 404
module.exports.UNKNOWN          = 500

module.exports.TWO_HUNDRED = "Success";
module.exports.TWO_HUNDRED_ONE = "Created";
module.exports.FOUR_HUNDRED = "Bad request";
module.exports.FOUR_HUNDRED_ONE = "Access denied";
module.exports.FOUR_HUNDRED_THREE = "FORBIDDEN";
module.exports.FOUR_HUNDRED_FOUR = "Not found";
module.exports.FIVE_HUNDRED = "Internal server error";

module.exports.SYMBOL_PLUS = "+"

module.exports.CURRENT_DATE = new Date().toISOString();
module.exports.DATE = new Date()
module.exports.SET_RESPONSE =  ( status, message, code, timestamp, route, serverCode) => {
    let r = {
        status : status,
        message : message,
        code : code,
        time : timestamp,
        route : route,
        server_code : serverCode
    };
    Object.keys(r).forEach( k => { if(!r[k]) { delete r[k] } } );
    return r;
}
module.exports.ENCODE_SQL_TIMESTAMP = dateClone => {
    return `${dateClone.toLocaleDateString().split('/').reverse().map(k => k.length === 1 ? '0'+k : k).join('-')} ${dateClone.toGMTString().split(' ')[4]}`
}
module.exports.DECODE_SQL_TIMESTAMP = t => {
    t = t.split(/[- :]/);
    return `${new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]))}`
}
module.exports.generateUniqueIdentifier = length => 
Array(length).fill(false).map( _ => this.getRandomNumber(0,9) % 2 == 0 ? this.ALPHABETS_LOWER[this.getRandomNumber(0,26)] : this.getRandomNumber(0,9)).join('')
module.exports.SQL_KEY_VALUE = object => Object.keys(object).map( key => `${key} = "${object[key]}"` ).join(', ')
module.exports.IS_EMAIL = email => email.split('').indexOf('@') > -1;
module.exports.GENERATE_UUID = uuid.v4();
module.exports.KEYGEN = uuid.v1();
module.exports.IS_VALID_IDENTITY = identity => {
    if((identity.split('').indexOf('@') > -1)){
        return validator.isEmail(identity);
    }
    return validator.isMobilePhone(identity);
}
module.exports.CHECK_IF_EXPIRED = ( expiredIn, updatedAt ) => {
    let dateDiff = new Date().valueOf() - new Date(updatedAt).valueOf();
    dateDiff = (Number(dateDiff)/1000).toFixed();
    console.log(dateDiff , expiredIn)
    return dateDiff >= expiredIn
}
module.exports.getValidObjectFromClass = (_class) => {
    const newObj = {}
    Object.keys(_class).forEach(key => _class[key] ? newObj[key] = _class[key] : '')
    return newObj;
}
module.exports.GetterSetters = class GettersSetters{
    params = {};
    constructor(...params){
        const keys = params[0];
        const values = params[1];
        keys.map( (k, i) => this.params[k] = values[i] )
    }

    get(type){
        return this[`${type}`];
    }

    getAll(){
        return this;
    }

    set(types, value){
        types.forEach( (type, index) => this[`${type}`] = value[index] )
    }

    setIndividual(type, value){
        this[type] = value
    }
}
module.exports.KEYGEN_LEN = 15
module.exports.UNIQUE_ID_LEN = 20