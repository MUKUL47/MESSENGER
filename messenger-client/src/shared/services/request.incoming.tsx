import { IFriendRequest } from "../../interfaces/data-models";

export default class FriendRequest{
    private requests :IFriendRequest[]= []
    private pages = { start : 0, count : 10 }
    //getters
    public getRequests(index ?: number){
        return index ? this.requests[index] : this.requests
    }
    private getRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        return reqIdx > -1 ? this.requests[reqIdx] : null;
    }
    public getStatus(type : string, id : string){
        const req = this.getRequest(id)
        if(req){
            return req[type === 'accept' ? 'isApproving' : 'isRejecting']
        }
    }

    //setters
    private removeRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        if(reqIdx > -1){
            this.requests.splice(reqIdx, 1)
        }
    }
    public setApproveStatus(status : boolean, id : string, deleteLater ?: boolean){
        const req = this.getRequest(id)
        if(req){
            req.isApproving = status
        }
        if(req && deleteLater){
            this.removeRequest(id)
        }
        return this;
    }
    public setRejectStatus(status : boolean, id : string, deleteLater ?: boolean){
        const req = this.getRequest(id)
        if(req){
            req.isRejecting = status
        }
        if(req && deleteLater){
            this.removeRequest(id)
        }
        return this;
    }
    public resetRequests(){
        this.requests = []
        return this
    }
    public addRequest(request : IFriendRequest){
        const reqIdx = this.requests.findIndex(r => r.id === request.id);
        if(reqIdx > -1){
            this.requests.splice(reqIdx, 1)
        }
        this.requests.push(request)
        return this;
    }
    public addRequests(requests : IFriendRequest[]){
        requests.forEach(req => this.addRequest(req))
        return this;
    }
}