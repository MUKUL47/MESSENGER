import React, { useState, createContext } from "react";
import io from "socket.io-client";
import { url } from '../../../../shared/components/calls/config'
import { Subject } from 'rxjs'
export const SocketContext = createContext();
let s = io
export class SocketDataContext extends React.Component{
    socket = null;
    sendEvent = null;
    sendEventParams = null;
    eventEmitted = new Subject()

    friendListEvents = [
        'offline', 
        'isOnline', 
        'currentActiveFriends', 
        'refreshedFriendList',
        'onNotify',
        'logout',
        'sentMessage',
        'gotConversations',
        'gotMessage',
        'typing']
    constructor(props){
        super(props)
    }
    componentDidMount(){
        this.socket = s(url.base);
        this.friendListEvents.forEach(e => this.socket.on(e, params => this.eventEmitted.next({ event : e, params : params })))
        this.sendEvent = (key, data) => this.socket.emit(key, data)
        this.sendEventParams = (key, ...params) => this.socket.emit(key, ...params)
    }
    render(){
        return (
            <SocketContext.Provider 
             value = {
                 {   sendEvent : this.sendEvent,  
                     sendEventParams : this.sendEventParams,
                     socket : this.socket,
                     eventEmitted: this.eventEmitted }
                 }
                 >
                 {this.props.children}
            </SocketContext.Provider>
         )
    }
}