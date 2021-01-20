import {  Response, NextFunction, Request } from 'express'
import { Validator } from 'jsonschema'
import { IRegisterLogin } from '../interfaces/register-login.if';
import Schema, { objectFields } from '../properties/validators.json';
import { ErrorController } from '../utils/controllers.util';
import errorCodes from '../utils/error-codes.util';
import errorProperties from '../properties/error.properties'
import concat from 'concat-stream'
export default class InputValidatorMiddleware{
    public static valdiatePost(request : IRegisterLogin, response : Response, next : NextFunction) : void{
        try{
            const schema = Schema[request.originalUrl];
            const filteredField = {}
            objectFields[request.originalUrl].forEach((key : string) => {
                if(request[key]) filteredField[key] = request[key]
            })
            if(new Validator().validate(filteredField, schema).valid) return next()
            response.status(errorCodes.BAD_REQUEST).send(new ErrorController(errorCodes.BAD_REQUEST, errorProperties.INVALID_INPUT, request.originalUrl))
        }catch(e){
            response.status(errorCodes.UNKNOWN).send(new ErrorController(errorCodes.UNKNOWN, errorProperties.UNKNOWN_ERROR, request.originalUrl))
        }
    }
    public static parseJson(request : Request, response : Response, next : NextFunction) {
        return request.pipe(concat((data : any) => {
            try{
                request.body = JSON.parse(data.toString('utf8')); 
                next()
            }catch(e){
                response.status(errorCodes.UNKNOWN).send(new ErrorController(errorCodes.UNKNOWN, errorProperties.UNKNOWN_ERROR, request.originalUrl))
            }
        }))
    }
}