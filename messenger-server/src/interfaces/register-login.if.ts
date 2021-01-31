export interface ILogin{
    identity :string;
}
export interface IRegister extends ILogin{
    otp ?:string;
}