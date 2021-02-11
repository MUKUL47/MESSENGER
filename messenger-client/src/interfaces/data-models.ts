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
interface IRequest{
    id : string,
    name : string,
    image ?:any;
    index : number;
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
}
export interface IRequestSentClass{
    setStatus : (id : string, val : boolean, deleteLater ?:boolean) => IRequestSent
    searchToggle : (val : boolean) => IRequestSent
}