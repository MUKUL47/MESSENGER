const express = require('express')();
const routes = require('../../../config').routes;
const social = require('./socialResponse');
const middleware = require('../../middleware');

express.get(
    routes.social.search, 
    middleware.authenticateGet, 
    middleware.authenticate, 
    middleware.validateProfile,
    social.search
    )

express.put(
    routes.social.send, 
    middleware.authenticate, 
    middleware.validateProfile,
    middleware.readRaw, 
    social.sendRequest
    )

express.put(
    routes.social.remove, 
    middleware.authenticate,
    middleware.validateProfile,
    middleware.readRaw, 
    social.removeUser
    )

    
express.put(
    routes.social.revoke,
    middleware.authenticate,
    middleware.validateProfile,
    middleware.readRaw, 
    social.revokeRequest
)


express.put(
    routes.social.respond,
    middleware.authenticate,
    middleware.validateProfile,
    middleware.readRaw, 
    social.respondRequest
)

express.get(
    routes.social.network,
    middleware.authenticateGet, 
    middleware.authenticate,
    middleware.validateProfile,
    social.getMyNetwork
)

express.get(
    routes.social.getStatus,
    middleware.authenticateGet,
    middleware.authenticate,
    middleware.validateProfile,
    social.getStatus
)

exports.routes = express;