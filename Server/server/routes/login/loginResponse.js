
const queries = require('../../../database/queries')
const database = require('../../../database/database');
const table = require('../../../database/tables');
const utils = require('../../../utils');
const aws = require('../../AWS/main');
const response = require('../../responseController');
const { googleLogin, thirdParty } = require('./thirdPartyAuth');
const messages = response.ResponseMessages.login;
const error = response.ErrorResponseCode.login;
const commonMessage = response.ResponseMessages.common;
const tableKeys = table.TABLE_KEYS;
const tables = table.TABLES;

const login = async (req, res, next) => { 
    try{
        let body = req.body
        let identity = body.identity;
        let otp = body.otp;
        if(otp){
            let verification = await  database.globalFetch(tables.verification, tableKeys.identity, identity);
            if(!verification[0]) { res.status(utils.ACCESS_DENIED).send(); return; }
            let validOtp = verification[0].otp;
            let expiresIn = verification[0].expires_in;
            let createdAt = verification[0].created_at;
            let isExpired = (new Date() - new Date(`${createdAt}`))/1000 >= expiresIn;
            if( `${validOtp}` == `${otp}` && !isExpired){
                const user = await database.globalFetch(tables.users, tableKeys.identity, identity+"");
                let keygen =  utils.generateUniqueIdentifier(utils.KEYGEN_LEN)//utils.KEYGEN;
                let object = {  keygen : keygen,  updated_at : utils.CURRENT_DATE };
                await database.globalUpdate(tables.users, tableKeys.identity, identity,  utils.SQL_KEY_VALUE(object));
                await database.globalDelete(tables.verification, tableKeys.identity , identity);
                res.status(!user[0] ? utils.CREATED : utils.SUCCESS).send(
                    utils.SET_RESPONSE(
                        !user[0] ? utils.TWO_HUNDRED_ONE : utils.TWO_HUNDRED,
                        commonMessage.keygen(keygen),
                        response.ErrorResponseCode.common.keygen,
                        utils.CURRENT_DATE,
                        req.originalUrl
                    )
                )
                return;
            }else{
                await database.globalDelete(tables.verification, tableKeys.identity , identity);
                res.status(utils.ACCESS_DENIED).send();
                return;
            }
        }
        // let user = await database.globalFetch(tables.users, tableKeys.identity, identity+"");
        // if(!user[0]){
        //     res.status(utils.NOT_FOUND).send(
        //         utils.SET_RESPONSE(
        //             utils.FOUR_HUNDRED_FOUR,
        //             messages.userNotFound,
        //             error.userNotFound,
        //             utils.CURRENT_DATE,
        //             req.originalUrl
        //         )
        //     );
        //     return;
        // }
        let secret = utils.getRandomNumber(100000, 999999);
        let currentRequest = await database.globalFetch(tables.verification, tableKeys.identity, identity);
        if(currentRequest[0]){
            let obj = utils.SQL_KEY_VALUE({ otp : secret, created_at : utils.CURRENT_DATE });
            await database.globalUpdate(tables.verification, tableKeys.identity, identity, obj);
        }else{
            await database.updateOtpVerification(identity, secret, utils.CURRENT_DATE, process.env.OTP_EXPIRES_IN, 'LOGIN');
        }

        // utils.IS_EMAIL(identity) ?
        // await aws.sendEmails(utils.OTP_SUBJECT, utils.OTP_HTML(secret), identity, utils.OWNER_EMAIL):
        // await aws.sendSMS(utils.OTP_MESSAGE(secret), identity);

        res.status(utils.SUCCESS).send();

    }
    catch(e){
        console.log(e)
        res.status(utils.UNKNOWN).send(
            utils.SET_RESPONSE(
                utils.FIVE_HUNDRED,
                e,
                false,
                utils.CURRENT_DATE,
                req.originalUrl
            )
        )
    }
 }

 const profileUpdate = async (req, res, next) => {
     try{
        const errMsg = response.ResponseMessages.profile
        const invalidResponse = new queries.Response(utils.FOUR_HUNDRED, null, utils.CURRENT_DATE, req.originalUrl)
        const name = req.body.name;
        const blob = req.body.imageBlob;
        if(name){
            if(name.trim().length > 20){
                invalidResponse.message = errMsg.invalidNameLength;
            }
            else if(!name.trim().match(/[a-z|A-z]/)){
                invalidResponse.message = errMsg.invalidName;
            }
        }
        if(invalidResponse.message){
            res.status(utils.BAD_REQUEST).send(invalidResponse)
            return
        }
        await database.updateProfile(req.superUser.id, name, blob)
        res.send()
     }
     catch(ee){
         if(ee === 1){
            const badRequest = new queries.Response(utils.FOUR_HUNDRED, response.ResponseMessages.profile.duplicateName, utils.CURRENT_DATE, req.originalUrl)
            res.status(utils.BAD_REQUEST).send(badRequest)
            return
         }
         res.status(utils.UNKNOWN).send()
     }
 }

 const loginSession = async (req, res, next) => {
     const otp = req.body.otp;
     const identity = req.body.identity;
     const isAuth = req.body.isAuth;

     let keygen =  utils.generateUniqueIdentifier(utils.KEYGEN_LEN)//utils.KEYGEN;
     const userExist = await database.globalFetch(tables.users, tableKeys.identity, identity+"");
     const uniqueUserId = userExist[0] ? userExist[0]['id'] : utils.generateUniqueIdentifier(utils.UNIQUE_ID_LEN)
     const SQLTS = new Date().toISOString()
     const user = new queries.users(uniqueUserId, SQLTS, SQLTS, identity, keygen)
     try{
        //  if(isAuth){
        //     await database.initOrUpdateUser(user, userExist[0])
        //     res.status(!userExist[0] ? utils.CREATED : utils.SUCCESS).send(
        //         utils.SET_RESPONSE(
        //             !userExist[0] ? utils.TWO_HUNDRED_ONE : utils.TWO_HUNDRED,
        //             commonMessage.keygen(keygen),
        //             response.ErrorResponseCode.common.keygen,
        //             utils.CURRENT_DATE,
        //             req.originalUrl
        //         )
        //     )
        //     return
            
        //  }
         if(otp){
            let verification = await  database.globalFetch(tables.verification, tableKeys.identity, identity);
            if(!verification[0]) { res.status(utils.ACCESS_DENIED).send(); return; }
            let validOtp = verification[0].otp;
            let expiresIn = verification[0].expires_in;
            let isExpired = (new Date() - new Date(`${verification[0].created_at}`))/1000 >= expiresIn;
            console.log('v->',req.body, validOtp, (validOtp == otp), !isExpired)
            if(validOtp == otp && !isExpired){
                await database.initOrUpdateUser(user, userExist[0])
                await database.globalDelete(tables.verification, tableKeys.identity , identity);
                res.status(!userExist[0] ? utils.CREATED : utils.SUCCESS).send(
                    utils.SET_RESPONSE(
                        !userExist[0] ? utils.TWO_HUNDRED_ONE : utils.TWO_HUNDRED,
                        commonMessage.keygen(keygen),
                        response.ErrorResponseCode.common.keygen,
                        utils.CURRENT_DATE,
                        req.originalUrl
                    )
                )
                return;
            }else{
                await database.globalDelete(tables.verification, tableKeys.identity , identity);
                res.status(utils.ACCESS_DENIED).send();
                return;
            }
         }

        let secret = 123456//utils.getRandomNumber(100000, 999999);
        let currentRequest = await database.globalFetch(tables.verification, tableKeys.identity, identity);
        if(currentRequest[0]){
            let obj = utils.SQL_KEY_VALUE({ otp : secret, created_at : new Date().toISOString() });
            await database.globalUpdate(tables.verification, tableKeys.identity, identity, obj);
        }else{
            await database.updateOtpVerification(identity, secret, new Date().toISOString(), process.env.OTP_EXPIRES_IN, 'LOGIN');
        }

        // utils.IS_EMAIL(identity) ?
        // await aws.sendEmails(utils.OTP_SUBJECT, utils.OTP_HTML(secret), identity, utils.OWNER_EMAIL):
        // await aws.sendSMS(utils.OTP_MESSAGE(secret), identity);

        res.status(utils.SUCCESS).send();
        return
     }catch(e){
         console.error(e)
        res.status(utils.UNKNOWN).send();
     }
 }

 const profile = async (req, res, next) => {
     try{
         const secret = req.superUser
         const targetUserId = req.params.id != '_' ? req.params.id : false;
         const data = await database.getProfileById(targetUserId ? targetUserId : secret.id)
         if(data[0]){
            data[0]['image_blob'] = data[0]['image_blob'].toString().length > 0 ? 
                                    data[0]['image_blob'].toString() : 
                                    null
         }
         res.send(data)
     }catch(ee){
         console.log('eee',ee)
        res.status(utils.UNKNOWN).send(ee);
     }
 }

 const logout = async (req, res, next) => {
     try{
         console.log(req.headers)
        const userId = req.headers.userid;
        console.log(userId)
        if(!userId || userId.trim().length === 0){
            res.send();
            return
        }
        const ll = await database.globalUpdateSingle('users', 'keygen', null, 'id', userId)
        console.log(ll)
        res.send();
     }catch(e){
        console.error('logout e',e)
        res.status(utils.UNKNOWN).send();
     }
 }

 const thirdPartyLogin = async (req, res, next) => {
     try{
        const identity = await thirdParty(req.headers.logintype, req.headers.token)
        const keygen =  utils.generateUniqueIdentifier(utils.KEYGEN_LEN)//utils.KEYGEN;
        const userExist = await database.globalFetch(tables.users, tableKeys.identity, `${identity}`);
        const uniqueUserId = userExist[0] ? userExist[0]['id'] : utils.generateUniqueIdentifier(utils.UNIQUE_ID_LEN)
        const SQLTS = new Date().toISOString()
        const user = new queries.users(uniqueUserId, SQLTS, SQLTS, identity, keygen)
        await database.initOrUpdateUser(user, userExist[0])
        const responseBean = utils.SET_RESPONSE(
            !userExist[0] ? utils.TWO_HUNDRED_ONE : utils.TWO_HUNDRED,
            commonMessage.keygen(keygen),
            response.ErrorResponseCode.common.keygen,
            utils.CURRENT_DATE,
            req.originalUrl
        )
        res.status(!userExist[0] ? utils.CREATED : utils.SUCCESS).send({...responseBean, identity : identity})
        return
     }catch(err){console.log(err)
        res.status(utils.ACCESS_DENIED).send(JSON.stringify(err));
     }
 }


 

 module.exports.thirdPartyLogin = thirdPartyLogin;
 module.exports.profileUpdate = profileUpdate;
 module.exports.profile = profile;
 module.exports.logout = logout;
 module.exports.login = loginSession//login;
 