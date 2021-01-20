import { Request } from "express";
export interface IRegisterLogin extends Request{
    identity ?:string;
    password ?:string;
}
export interface IThirdPartAuth extends Request{
    
}