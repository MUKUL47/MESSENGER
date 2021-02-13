export default interface IApiResponse{
    statusCode : number,
    message : Object | string,
    timestamp : string,
    route : string
}
export interface IFriend{
    id : string,
    name : string,
    image : any,
    Messages : IMessage[],
    index : number;
}
export interface IMessage{
    id : string,
    ownerId : string,
    friendId : string,
    date : string,
    message : string
}
export interface IRequest{
    createdAt : string,
    id : string,
    displayName : string,
    identity : string,
    image ?:any;
}
export interface IRequestSent extends IRequest{
    isRevoking : boolean,
}
export interface IFriendRequest extends IRequest{
    isApproving : boolean,
    isRejecting : boolean,
}
export interface ISearchRequest extends IRequest{
    sending : boolean,
}
export interface IFriendRequestClass{
    setApproveStatus : (status : boolean, id : string, deleteLater ?:boolean) => IFriendRequest
    setRejectStatus : (status : boolean, id : string, deleteLater ?:boolean) => IFriendRequest
    pages : { count : number, start : number }
    addRequests : (user : IRequest | IRequest[]) => any
    resetRequests : () => any
}
export interface IRequestSentClass{
    setStatus : (id : string, val : boolean, deleteLater ?:boolean) => IRequestSent
    searchToggle : (val : boolean) => IRequestSent
    combineAll : (functions : string[], args : any[]) => IRequestSent
    pages : { count : number, start : number }
    resetRequests : () => any
    addRequests : (user : IRequest | IRequest[]) => any
}