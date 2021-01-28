import {  Response, NextFunction, Request } from 'express'
import { Validator } from 'jsonschema'
import Schema, { params } from '../properties/validators.json';
import { ErrorController } from '../utils/controllers.util';
import errorCodes from '../utils/error-codes.util';
import errorProperties from '../properties/error.properties'
import concat from 'concat-stream'
import logger from '../utils/logger.util';
export default class InputValidatorMiddleware{
    public static valdiatePost(request : Request, response : Response, next : NextFunction) : void{
        try{
            const schema = Schema[request.originalUrl];
            if(new Validator().validate(request.body, schema).valid) return next()
            response.status(errorCodes.BAD_REQUEST).send(new ErrorController(errorCodes.BAD_REQUEST, errorProperties.INVALID_INPUT, request.originalUrl))
        }catch(e){
            logger.error(`InputValidatorMiddleware valdiatePost : ${e}`)
            response.status(errorCodes.UNKNOWN).send(new ErrorController(errorCodes.UNKNOWN, e, request.originalUrl))
        }
    }
    private static parseJson(request : Request, response : Response, next : NextFunction) {
        return request.pipe(concat((data : any) => {
            try{
                request.body = JSON.parse(data.toString('utf8')); 
                next()
            }catch(e){
                logger.error(`InputValidatorMiddleware parseJson : ${e}`)
                response.status(errorCodes.UNKNOWN).send(new ErrorController(errorCodes.UNKNOWN, JSON.stringify(e), request.originalUrl))
            }
        }))
    }
    public static verifyParameters(request : Request, response : Response, next : NextFunction){
        try{
            const param = params[request.originalUrl.split('?')[0]];
            if(new Validator().validate(request.query, param).valid) return next()
            response.status(errorCodes.BAD_REQUEST).send(new ErrorController(errorCodes.BAD_REQUEST, errorProperties.INVALID_PARAMETERS, request.originalUrl))
        }catch(e){
            logger.error(`InputValidatorMiddleware verifyParameters : ${e}`)
            response.status(errorCodes.UNKNOWN).send(new ErrorController(errorCodes.UNKNOWN, e, request.originalUrl))
        }
    }
}