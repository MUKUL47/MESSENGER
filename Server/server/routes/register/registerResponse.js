const database = require('../../../database/database');
const utils = require('../../../utils');
const aws = require('../../AWS/main');
const response = require('../../responseController');
const table = require('../../../database/tables');
const tableKeys = table.TABLE_KEYS;
const tables = table.TABLES;
const uuid = require('uuid');

const generateOtp = async function generateOtp(req, res, next){
    try{
        let body = req.body;
        let identity = body.identity;
        let user = await database.globalFetch(tables.users, tableKeys.identity, identity);
        let message = response.ResponseMessages.register;
        let code = response.ErrorResponseCode.register;
        
        if(user.length == 0){
            let secret = utils.getRandomNumber(100000, 999999);
            let user = await database.globalFetch(tables.verification, tableKeys.identity, identity); 

            utils.IS_EMAIL(identity) ? 
            await aws.sendEmails(utils.OTP_SUBJECT, utils.OTP_HTML(secret), identity, utils.OWNER_EMAIL):
            await aws.sendSMS(utils.OTP_MESSAGE(secret), identity);

            user[0] ?
            await database.updateVerification(tableKeys.identity, identity, secret, utils.CURRENT_DATE, process.env.OTP_EXPIRES_IN) : 
            await database.updateOtpVerification(identity, secret, utils.CURRENT_DATE, process.env.OTP_EXPIRES_IN, 'REGISTER');
            
            res.status(utils.SUCCESS).send();
        }else{
            res.status(utils.BAD_REQUEST).send(
                utils.SET_RESPONSE(
                    utils.FOUR_HUNDRED, 
                    message.userExist, 
                    code.userExist,
                    utils.CURRENT_DATE, 
                    req.originalUrl )
                );
            return;
        }
    }
    catch(e){
        console.log(e)
        res.status(utils.UNKNOWN).send(e);
    }
}

const verifyOtp = async function verifiyOtp(req, res, next){
    try{
        let body = req.body
        let otp = body.otp;
        let identity = body.identity;
        let message = response.ResponseMessages.register;
        let code = response.ErrorResponseCode.register;
        let user = await database.globalFetch(tables.verification, tableKeys.identity, identity);
        let common = response.ResponseMessages.common;
        let invalidResponse = utils.SET_RESPONSE(
                                    utils.FOUR_HUNDRED_THREE, 
                                    message.incorrectOtp, 
                                    code.incorrectOtp, 
                                    utils.CURRENT_DATE, 
                                    req.originalUrl);
        if(!user[0]){
            res.status(utils.ACCESS_DENIED).send(invalidResponse)
            return;
        }
        else {
            let isValid = `${user[0].otp}` == `${otp}`;
            let isExpired = (new Date() - new Date(`${user[0].created_at}`))/1000 >= user[0].expires_in;
            if(!isValid){
                res.status(utils.ACCESS_DENIED).send(invalidResponse)
                return;
            }
        }
        let keygen =  utils.generateUniqueIdentifier(utils.KEYGEN_LEN);
        await database.initUser(
            utils.generateUniqueIdentifier(utils.UNIQUE_ID_LEN), 
            utils.CURRENT_DATE, 
            utils.CURRENT_DATE, 
            `${identity}`, 
            process.env.PASSWORD_EXPIRES_IN,
            keygen
           );

        await database.globalDelete(tables.verification, tableKeys.identity, identity);

        res.status(utils.CREATED).send(
            utils.SET_RESPONSE(
                utils.TWO_HUNDRED_ONE, 
                common.keygen(keygen), 
                code.userRegistered, 
                utils.CURRENT_DATE, 
                req.originalUrl)
            ) 
        return;
    }
    catch(e){
        console.log(e)
        res.status(utils.UNKNOWN).send(JSON.stringify(e));
    }
}

module.exports.generateOtp = generateOtp;
module.exports.verifyOtp = verifyOtp;
