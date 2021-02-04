export default interface IApiResponse{
    statusCode : number,
    message : Object | string,
    timestamp : string,
    route : string
}