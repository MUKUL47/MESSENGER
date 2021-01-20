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