const concat = require('concat-stream');
const config = require('../config');
const utils = require('../utils');
const response = require('./responseController');
const Regex = require('../config').regex;
const database = require('../database/database');
const commonMessages = response.ResponseMessages.common;
const commonError = response.ErrorResponseCode.common;
const social = require('./routes/social/socialClass');
const queries = require('../database/queries')

exports.readRaw = (req, res, next) => {
        return req.pipe(concat( data => { 
            try{
                req.body = JSON.parse(data.toString('utf8')); 
                next(); 
            }
            catch(err){
                res.status(utils.BAD_REQUEST).send(
                    utils.SET_RESPONSE(
                        utils.FOUR_HUNDRED, 
                        commonMessages.invalidJson, 
                        commonError.invalidJson, 
                        utils.CURRENT_DATE, 
                        req.originalUrl))
            }
        }))
}

exports.validateFields = (req, res, next) => {
    try{
        let originalBody = req.body;
        console.log(originalBody)
        let missingFields = validateFields(req.originalUrl, originalBody);
        if(missingFields.length === 0){ next(); return;}
        let invalidFields = missingFields.join(', ');
        res.status(utils.BAD_REQUEST)
        .send(utils.
            SET_RESPONSE(utils.FOUR_HUNDRED, 
                commonMessages.invalidFields(invalidFields), 
                commonError.invalidFields, 
                utils.CURRENT_DATE, 
                req.originalUrl ))
        return;
    }
    catch(err){
        console.log(err)
        res.status(utils.UNKNOWN).send()
    }
}

exports.validateObjects = (req, res, next) => {
    let body = req.body;
    let keys = Object.keys(body);
    invalid = [];
    keys.forEach(key => { if (Regex[key] && !body[key]+"".match(Regex[key])) { invalid.push(key) } })
    if (invalid.length == 0) { next(); return; }
    let invalidFields = invalid.join(', ');
    res.status(utils.BAD_REQUEST)
    .send(utils.
        SET_RESPONSE(utils.FOUR_HUNDRED, 
            commonMessages.invalidFields(invalidFields), 
            commonError.invalidFields, 
            utils.CURRENT_DATE, 
            req.originalUrl ))
    return;
}

exports.validateIdentity_ = (req, res, next) => {
    const identity = req.body.identity.toLowerCase();
    if(utils.IS_VALID_IDENTITY(identity)){
        next();
        return;
    }
    res.status(utils.BAD_REQUEST)
    .send(utils.
        SET_RESPONSE(utils.FOUR_HUNDRED, 
            commonMessages.invalidIdentity, 
            commonError.invalidIdentity, 
            utils.CURRENT_DATE, 
            req.originalUrl,
            utils.BAD_REQUEST ))
}

exports.validateIdentity = (req, res, next) => {
    const identity = req.params.identity.trim();
    if(!utils.IS_VALID_IDENTITY(identity)){
        res.status(utils.BAD_REQUEST).send(social.common.invalidIdentity(identity, req.originalUrl))
        return;
    }
    next();
}

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.headers.secret;
        const errResp = _ => res.status(utils.ACCESS_DENIED)
        .send(utils.
            SET_RESPONSE(utils.FOUR_HUNDRED_ONE, 
                commonMessages.invalidSecret, 
                commonError.invalidSecret, 
                utils.CURRENT_DATE, 
                req.originalUrl,
                utils.ACCESS_DENIED ));

        if(!token){
            errResp();
            return;
        }
        const identity = await database.globalFetch('users', 'keygen', token);
        if(!identity[0] || identity[0] && utils.CHECK_IF_EXPIRED(Number(process.env.SESSION_EXPIRES_IN), `${identity[0].updated_at}`) ){
            errResp();
            return;
        }
        req['superUser'] = identity[0];
        next()
        return;
    }catch(ee){
        console.log('authenticate err',ee)
        res.status(utils.UNKNOWN).send()
    }
}

exports.authenticator = function authenticator(token){
    return new Promise(async (resolve, reject) => {
        try{
            const identity = await database.globalFetch('users', 'keygen', token);
            if(!identity[0] || identity[0] && utils.CHECK_IF_EXPIRED(Number(process.env.SESSION_EXPIRES_IN), `${identity[0].updated_at}`) ){
                reject({ message : 'INVALID TOKEN' })
                return;
            }
            resolve(identity[0])
        }
        catch(ee){
            reject({ message : 'INVALID TOKEN' })
        }
    })
}

exports.validateProfile = async (req, res, next) => {
    try{
        const profile = await database.getProfileById(req.superUser.id)
        if(!profile || profile.length === 0){
            const badResponse = new queries.Response(
                utils.FOUR_HUNDRED,
                response.ResponseMessages.social.invalidProfile,
                utils.CURRENT_DATE,
                req.originalUrl
                )
            res.status(utils.BAD_REQUEST).send(badResponse)
            return;
        }
        next();
    }catch(ee){
        res.status(utils.UNKNOWN).send(ee)
    }
}

exports.authenticateGet = async (req, res, next) => {
    try{
        if(utils.AUTHENTICATE_GET_ACCESS.includes(req.headers.type)){
            next();
            return;
        }
        res.status(utils.FORBIDDEN).send('RESTRICTRED')
    }catch(ee){
        res.status(utils.FORBIDDEN).send('RESTRICTRED')
    }
}

function validateFields(url, body){
    let validFields = config.validFields[url];
    let keys = Object.keys(body);
    let missing = [];
    validFields.map( key => { if(keys.indexOf(key) == -1) missing.push(key) })
    return missing;
}