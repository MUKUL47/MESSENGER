const express = require('express')();
const response = require('./registerResponse');
const routes = require('../../../config').routes;
const middleware = require('../../middleware');

express.post(routes.register, middleware.readRaw, middleware.validateFields, middleware.validateIdentity_, response.generateOtp);

express.post(routes.otp, middleware.readRaw, middleware.validateFields, middleware.validateObjects, response.verifyOtp);

exports.routes = express;