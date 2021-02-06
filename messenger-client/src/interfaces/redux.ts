export interface IUserStore{
    name : string,
    id : string,
    image : any,
    identity : string
}
export interface IToastStore{
    type : 'success' | 'failed',
    message : string,
    rand : number
}
interface IMessages{
    isOwned : boolean, 
    message : string,
    date : string
}
export interface  IMessageStore{
    friendId : string,
    friendName : string,
    friendImage : any,
    messages : IMessages[]
}
export interface IAction{
    type : string,
    data ?:any
}
export interface ILoaderStore{
    id : number,
    type : boolean
}