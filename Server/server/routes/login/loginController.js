const express = require('express')();
const responses = require('./loginResponse');
const routes = require('../../../config').routes;
const middleware = require('../../middleware');
const multer = require('multer')({ dest: 'uploads/' });

express.post(
    routes.login, 
    middleware.readRaw, 
    middleware.validateFields, 
    responses.login
    );
    
express.get(
    routes.logout,
    middleware.authenticateGet,
    responses.logout
    )

express.put(
    routes.profile.update, 
    middleware.readRaw, 
    middleware.authenticate, 
    middleware.validateFields, 
    responses.profileUpdate
    )

express.get(
    routes.profile.get,
    middleware.authenticateGet,
    middleware.authenticate,
    responses.profile
    )

express.get(
    routes.thirdParty.authorize,
    middleware.authenticateGet,
    responses.thirdPartyLogin
    )
// express.get(routes.logout, responses.profile)

exports.routes = express;
