import Bluebird from "bluebird"
import { Connection, QueryFunction } from "mysql";
import * as socket from 'socket.io'
export interface IMysql extends Bluebird<Connection>{
    query : QueryFunction
}
export interface IController{
    statusCode : number;
    message : string| object;
    timestamp : number | Date;
    route ?:string;
}
export interface ISuperUser{
    userId : string;
    createdAt : string;
    updatedAt : string;
    identity : string;
}
export interface IsendMessage{
    message : string,
    userId : string,
    targetId : string,
    id : string
}
export interface ISocket extends socket.Server{
    id : string
}

export interface IMessageChunk{
    createdAt : string
    updatedAt : string
    participant : String
    messages : IMessage[]
}

export interface IMessage{
    author : string
    createdAt : string
    message : string
}
export interface IRedisData{
    token : string,
    args ?: any
}