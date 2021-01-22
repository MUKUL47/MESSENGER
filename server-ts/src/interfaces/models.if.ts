import Bluebird from "bluebird"
import { Connection, QueryFunction } from "mysql";
export interface IMysql extends Bluebird<Connection>{
    query : QueryFunction
}
export interface IController{
    statusCode : number;
    message : string;
    timestamp : number | Date;
    route ?:string;
}