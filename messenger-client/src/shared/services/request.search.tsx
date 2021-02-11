import { ISearchRequest } from "../../interfaces/data-models"
export default class SearchRequest{
    private requests :ISearchRequest[]= []
    private searching : boolean = false;
    private pages = { start : 0, count : 10 }
    //getters
    public getRequests(index ?: number){
        return index ? this.requests[index] : this.requests
    }
    public getStatus(id : string){
        return this.requests.find(req => req.id === id)?.sending
    }
    private getRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        return reqIdx > -1 ? this.requests[reqIdx] : null;
    }
    public isSearching(){
        return this.searching;
    }
    //setters
    public removeRequest(id : string){
        const reqIdx = this.requests.findIndex(r => r.id === id);
        if(reqIdx > -1){
            this.requests.splice(reqIdx, 1)
        }
    }
    public searchToggle(val : boolean){
        this.searching = val;
        return this
    }
    public setStatus(id : string, val : boolean, deleteLater?:boolean){
        const req = this.getRequest(id)
        if(req){
            req.sending = val
        }
        if(req && deleteLater){
            this.removeRequest(id)
        }
        return this;
    }
    public addRequest(request : ISearchRequest){
        const req = this.getRequest(request.id)
        if(req){
            this.requests.splice(request.index, 1)
        }
        this.requests.push({...request, index : this.requests.length })
        return this;
    }
    public addRequests(requests : ISearchRequest[]){
        requests.forEach(req => this.addRequest(req))
        return this;
    }
}