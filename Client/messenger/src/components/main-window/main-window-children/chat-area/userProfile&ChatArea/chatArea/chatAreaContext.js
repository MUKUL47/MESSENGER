import React, {createContext, useContext, useState, useEffect} from 'react'
import { SocketContext } from '../../../socketCommunication/socketContext'
import * as lodash from 'lodash'
export const ChatAreaContextData = createContext();
export const ChatAreaContext = props => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState({})
    const [isTyping, setTyping] = useState(false)
    let tt;
    useState(() => {
        console.log('messages-clone1123123',messages)
    })
    const setTempMessages = (id, msgs) => {
        
        const index = lodash.findIndex(messages, { id : id })
        if(index === -1){
            const obj = { id : id, messages : msgs };
            let clone = messages
            clone.push(obj)
            setMessages(clone)
            setMessage({ id : id, messages : msgs })
            return;
        }
        setMessage(messages[index])
    }

    const updateMessages = (id, message) => {
        const index = lodash.findIndex(messages, { id : id })   
        if(index > -1){
            const clone = [...messages]
            clone[index]['messages'].push(message)
            setMessages(clone)
        }
    }
    
    const setMessageStatus = (id, messageId, status) => {
        const index = lodash.findIndex(messages, { id : id })   
        console.log('cloneMessages i',index, messages)
        console.log('id, messageId, status',id, messageId, status)
        if(index > -1){
            const cloneMessages = [...messages]
            const messageIndex = lodash.findIndex(cloneMessages[index]['messages'], { _id : messageId }) 
            console.log('mess---',messageIndex, cloneMessages[index]['messages'][messageIndex])
            if(messageIndex > -1){
                cloneMessages[index]['messages'][messageIndex]['status'] = status;
                setMessages(cloneMessages)
            }
        }
    }

    const typingStatus = e => {
        if(tt) clearTimeout(tt);
        setTyping(e)
        tt = setTimeout(() => {
            setTyping(false);
            tt = null;
        }, 1000)
    } 
    return (
        <ChatAreaContextData.Provider 
            value = {
                {   
                    messages : { get : messages, set : setTempMessages },
                    message : { get : message, set : setMessage },
                    updateMessages : updateMessages,
                    setMessageStatus : setMessageStatus,
                    typing : {set : typingStatus, get : isTyping} ,
                }
            }
        >
            {props.children}
        </ChatAreaContextData.Provider>
    )
}