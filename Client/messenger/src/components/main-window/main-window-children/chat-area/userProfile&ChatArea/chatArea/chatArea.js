import React, {useContext, useState, useEffect, createRef} from 'react'
import './chatArea.scss'
import { ProfileArea } from '../profileArea/profileArea'
import { TextField, SendIcon, CircularProgress } from '../../../../../../shared/components/material-ui-modules'
import { ChatAreaContextData } from './chatAreaContext'
import { SocketContext } from '../../../socketCommunication/socketContext'
import { FriendListContext } from '../../../friends/friendListContext'
import { MessageArea } from './messageArea/messageArea'
import * as lodash from 'lodash'
export const ChatArea = props => {
    const socketContext = useContext(SocketContext)
    const chatAreaContextData = useContext(ChatAreaContextData)
    const friendListContext = useContext(FriendListContext)
    const [message, setMessage] = useState('')
    const [chatReady, setChatReady] = useState(null)
    const [listener, setListener] = useState(false)
    const messageBlock= createRef()
    const selectedFriend = friendListContext.selectedFriendInChat.get;
    const credentials = () => {
        const senderId = localStorage.getItem('id')
        const obj = Object.keys(localStorage).filter(v => v != 'id')[0]
        const secret = localStorage.getItem(obj)
        return { id : senderId, secret : secret }
    }

    useEffect(() => {
        if(listener)return
        setListener(socketContext.eventEmitted.subscribe({ next : eventListeners}))
        return function(){ if(listener) listener.unsubscribe() }
    },[selectedFriend])

    useEffect(() => {
        // console.log('user0-0',selectedFriend.userId, chatAreaContextData.messages.get)
        const index = lodash.findIndex(chatAreaContextData.messages.get, { id : selectedFriend.userId })
        console.log('chatAreaContextData.messages.get[index]-',index, chatAreaContextData.messages, selectedFriend.userId)
        if(index > -1){
            const obj = chatAreaContextData.messages.get[index];
            if(obj.messages.length > 0){
                chatAreaContextData.message.set(obj)
                return
            }
        }
        console.log('fetch friends',selectedFriend.userId)
        console.log('fetch friends',localStorage)
        setChatReady(null)
        const cred = credentials()
        socketContext.sendEventParams('getConversations', cred.secret, [cred.id, selectedFriend.userId])
    },[selectedFriend])

    useEffect(() => {
        document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
    },[chatAreaContextData.messages])

    const onClickEvent = e => {
        if(message.trim().length === 0 || !chatReady) return;
        const cred = credentials()
        const friendId = selectedFriend.userId
        const uniqueId = new Date().valueOf()
        socketContext.sendEventParams('sendMessage', cred.id, cred.secret, [cred.id, friendId], message.trim(), uniqueId)
        const temp =  { 
            _id : uniqueId, 
            createdAt : new Date(), 
            content : message.trim(),
            status : 'pending',
            author : localStorage.getItem('id')
        }
        chatAreaContextData.updateMessages(friendId, temp);
        setMessage('')
    }

    const isTyping = e => {
        socketContext.sendEvent('isTyping', { id : localStorage.getItem('id'), friendId : selectedFriend.userId })
    }

    const eventListeners = event => {
        console.log('eventListeners--',event)
        switch(event.event){
            case 'sentMessage' : {
                const friendId = event.params.friendId
                chatAreaContextData.setMessageStatus(friendId, event.params.identifier, !event.params.error ? 'success' : 'failed');
                return;
            }
            case 'gotConversations' : {
                const messages = event.params.response ? event.params.response.messages : []
                chatAreaContextData.messages.set(event.params.targetId, messages);
                setChatReady(true)
                return;
            }
            case 'gotMessage' : {
                console.log(event)
                chatAreaContextData.updateMessages(event.params.friendId, {...event.params.message, _id : new Date().valueOf()});
                return;
            }

            case 'typing' : {
                // if(event.params.id === localStorage.getItem('id') && 
                //     event.params.friendId === selectedFriend.userId ){
                    console.log('chatAreaContextData.message.get.id--',chatAreaContextData.id)
                // if(event.params.friendId === selectedFriend.userId){
                    chatAreaContextData.typing.set(event.params.friendId)
                // }
                return;
                // }
            }

            case 'logout' : {
                if(event.params.id === localStorage.getItem('id')){
                    window.location.reload()
                }
            }
        }
    }
    return (
        <div className="ChatArea">
                <div className="messages" ref={messageBlock}>
                    {
                        chatReady ? 
                        <div> 
                            <MessageArea/>
                        </div> :
                        <div className='waitConvo'>
                            <CircularProgress id='loader'/>
                            <div id='loader'>
                                Loading Conversations...
                            </div>
                        </div>

                    }
                </div>
            <div className="message-area">
                <TextField 
                    className="message-text" 
                    placeholder="Type a message"
                    variant="outlined" 
                    multiline
                    rowsMax={2}
                    onChange = {e => setMessage(e.target.value)}
                    value = {message}
                    onKeyDown = {isTyping}
                />
                <SendIcon 
                    id='sendBtn' 
                    onClick = {onClickEvent}
                />
            </div>
        </div>
    )
}