import Dialog from '@material-ui/core/Dialog';
import React from 'react'
import { AddFriendsUI } from './ui/addFriendsUi'
import './ui/addFriendsUi.scss'
import { Api, globalMessages  } from '../../../../../shared/components/calls/server'
import { parseError,getRandomNumber } from '../../../../../shared/components/utils/short'
import { Observable } from 'rxjs'
import { manipluateUserCall } from '../../profile/requests/requestApi'
import * as _ from 'lodash'
export class AddFriends extends React.Component{
    constructor(props){
        super(props)
        this.itemsPerPage = 5;
        this.state = {
            isResults : false,
            results : [],
            isFetching : false,
            startIndex : 0,
            count : 5,
            currentQuery : ''
        }
    }


    render(){
        return(<div>
            <Dialog aria-labelledby="simple-dialog-title" 
                open={this.props.isOpen}>
                    <div className="close-friends-dialog" onClick={e => this.props.closed()}>x</div>
                    <AddFriendsUI 
                        {...this.state}
                        onFriendRequest = {this.onFriendSelect}
                        onInputChange={this.onInputChange}
                        onPageChange={this.onPageChange}
                        manipulateRequests = {this.maniplulateRequests}
                        requests = {this.requests}
                    />
            </Dialog>
        </div>)
    }

    onInputChange = async (e) => {
        if(e.trim().length === 0) return;
        try{
            this.setState({...this.state, isFetching : true, currentQuery : e.trim().toLowerCase()})
            const response = await Api.getUsers(e.trim().toLowerCase(), this.state.startIndex, this.itemsPerPage)
            console.log(response['data']['count'],this.itemsPerPage)
            this.setState({
                ...this.state, 
                isFetching : false, 
                isResults : true,
                results : response['data']['users'],
                count : Math.ceil(response['data']['count']/this.itemsPerPage)
            })
            console.log(this.state)
        }catch(ee){
            this.setState({...this.state, isFetching : false}) 
            globalMessages.next({message : parseError(ee)})
        }
    }

    onClose(){

    }

    onFriendSelect(e){
        console.log(e)
        
    }

    onPageChange = async (e, page) => {
        try{
            this.setState({
                ...this.state, 
                isFetching : true 
            })
            const start = (page-1)*this.itemsPerPage;
            const response = await Api.getUsers(this.state.currentQuery, start, this.itemsPerPage)
            this.setState({
                ...this.state, 
                isFetching : false, 
                isResults : true,
                results : response['data']['users'],
                count : Math.ceil(response['data']['count']/this.itemsPerPage)
            })
        }
        catch(ee){
            this.setState({...this.state, isFetching : false}) 
            globalMessages.next({message : parseError(ee)})
        }
    }

    requests = (requestType, id, answer, addedUser) => {  
        return new Promise(async (resolve, reject) => {
            try{
                if(requestType === 'add'){
                    await Api.sendRequest(id)
                    console.log('added-')
                    manipluateUserCall.next({ type : 'add', id : id })
                }
                else if(requestType === 'revoke'){
                    await Api.revokeRequest(id)
                }
                else if(requestType === 'respond'){
                    await Api.respondRequest(id, answer)
                    console.log('_addedUser_',addedUser)
                    manipluateUserCall.next({ type : 'respond', resp : answer, id : id, addedUser : addedUser })
                }
                else if(requestType === 'remove'){
                    await Api.removeUser(id)
                    manipluateUserCall.next({ type : 'remove', id : id })
                }
                resolve()
            }catch(ee){
                reject(ee)
            }
        })
    }
}