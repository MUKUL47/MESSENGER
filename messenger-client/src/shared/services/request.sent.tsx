import { IRequestSent } from "../../interfaces/data-models"
export default class SentRequest{
    private requests :IRequestSent[]= []
    private pages = { start : 0, count : 10 }
    //getters
    public getRequests(index ?: number){
        return index ? this.requests[index] : this.requests
    }
    public getStatus(id : string){
        return this.requests.find(req => req.id === id)?.isRevoking
    }
    private getRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        return reqIdx > -1 ? this.requests[reqIdx] : null;
    }
    //setters
    public removeRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        if(reqIdx > -1){
            this.requests.splice(reqIdx, 1)
        }
    }
    public setStatus(id : string, val : boolean, deleteLater?:boolean){
        const req = this.getRequest(id)
        if(req){
            req.isRevoking = val
        }
        if(req && deleteLater){
            this.removeRequest(id)
        }
        return this;
    }
    public addRequest(request : IRequestSent){
        const req = this.getRequest(request.id)
        if(req){
            this.requests.splice(request.index, 1)
        }
        this.requests.push({...request, index : this.requests.length })
        return this;
    }
    public addRequests(requests : IRequestSent[]){
        requests.forEach(req => this.addRequest(req))
        return this;
    }
}