import { Response } from "express"
import { IController } from '../interfaces/models.if'
export class ErrorController{
    statusCode : number;
    message : string;
    timestamp : number | Date;
    route ?:string;
    constructor(statusCode : number, message : string, route ?:string){
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = new Date().valueOf();
        this.route = route;
    }
}

export class Controller{
    private static send(response : Response, controller : IController){
        response.status(controller.statusCode).send(controller)
    }
    protected static generateController(response : Response, statusCode : number, message : string, route ?:string){
        const controller = new ErrorController(statusCode, message, route)
        this.send(response, controller)
    }
}