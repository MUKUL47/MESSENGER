import { AxiosRequestConfig } from "axios";

export default interface IApiResponse{
    statusCode : number,
    message : any,
    timestamp : string,
    route : string
}
export interface IFriend{
    id : string,
    name : string,
    image : any,
    Messages: IMessage[],
    init?: boolean;
    count ?:number;
    status : boolean;
}
export interface IMessage{
    id : string,
    ownerId : string,
    friendId : string,
    createdAt : string,
    message : string,
    status : string
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
    searchedAlready : () => boolean;
    setSearch : () => IRequestSent;
}
export interface IRequestSentClass{
    setStatus : (id : string, val : boolean, deleteLater ?:boolean) => IRequestSent
    searchToggle : (val : boolean) => IRequestSent
    combineAll : (functions : string[], args : any[]) => IRequestSent
    pages : { count : number, start : number }
    resetRequests : () => IRequestSent
    addRequests : (user : IRequest | IRequest[]) => IRequestSent
    searchedAlready : () => boolean;
    setSearch : () => IRequestSent;
}
export interface FriendsClass{
    getFriend : (id : string, all ?:boolean) => IFriend
    getMessage : (friendId : string, messageId ?:string) => IMessage
    getActiveFriend : () => IFriend

    // setMessageStatus : (friendId : string, messageId : string, status : string) => IFriend[]
    // setFriendActive : (id : string) => IFriend[]
    // addFriends : (friends : IFriend[]) => IFriend[]
    // addFriend : (friend : IFriend) => IFriend[]
    // addMessage : (friendId : string, message :IMessage) => IFriend[]
    // addMessages : (friendId : string, messages :IMessage[]) => IFriend[]
    // combineAll : (functions : string[], args : any[]) => IRequestSent
}
export interface IResponse extends AxiosRequestConfig{
    data : IApiResponse
}