import React, { useEffect, useMemo, useReducer } from 'react'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import './message-area.scss'
import { Menu, MenuItem, MoreVertIcon, TextField, Tooltip } from '../../../../../../shared/material-modules'
import selectUser from '../../../../../../assets/select-user.svg'
import noMessages from '../../../../../../assets/no-messages.svg'
import { setGlobalToggleFunc } from '../../../../../../shared/utils'
import { IMessage } from '../../../../../../interfaces/data-models'
import { useSelector } from 'react-redux'

export default function MessageAreaRender(props : any) {
    const {
        isLoading,
        friends,
        activeFriend,
        selectedFriend,
        removeFriend,
        onRemoveFriend,
        sendMessage,
        friend,
        addedMessage,
        messageRandom,
        newFriendSelected,
        userTyped
    } = props;
    const renderContextData = {
        menuActive: false,
        value: '',
        typedFrequency : 0, //keep 5 secs delay,
        isTyping : false,
        timeStampId : -1
    }
    const [messageRenderContext, setMessageRenderContext] = useReducer(setGlobalToggleFunc, renderContextData);
    const { id, timestamp } = useSelector((s : any) => { return {...s['typingService']}}) 
    const messages = useMemo(() => {
        setTimeout(() => {
            let ele = (document as any).querySelector('.messages-area');
            if(ele ){
                ele.scrollTo({left : 0, top : ele.scrollHeight, behavior : messageRandom || newFriendSelected ? 'auto' : 'smooth'})
            }
        },50)
        return getMessages(friend?.Messages || [], activeFriend)
     }, [friend, addedMessage])

     useEffect(() => {
        if(id !== selectedFriend?.id || !friend?.status) return
        const timerId = setTimeout(() => setMessageRenderContext({ isTyping : false }),2500)
        clearTimeout(messageRenderContext.timeStampId)
        setMessageRenderContext({ isTyping : true, timeStampId : timerId })
     }, [timestamp])

    const typed = (e : any) => {
        setMessageRenderContext({value : e.target.value})
        const b = new Date(messageRenderContext.typedFrequency).valueOf();
        const a = new Date().valueOf();
        if((a - b)/1000 > 2.5){
            userTyped();
            setMessageRenderContext({typedFrequency : new Date().valueOf()})
        }
    }
    useEffect(() => {
        setMessageRenderContext({menuActive : false})
    }, [activeFriend])
    const message = () => {
        const v = messageRenderContext.value.trim();
        if (v.length > 0) {
            sendMessage(v)
            setMessageRenderContext({value : ''})
        }
        
    }
    return (
        activeFriend && selectedFriend['name']?
        <div className="message-area-render">
            <div className="message-profile">
                <div className="selected-pro">
                    <div className="profile--pic">
                        <img src={defaultPic} className="d_ps" />
                    </div>
                    <div className="profile--name">
                        {selectedFriend['name']}
                    </div>
                    <Tooltip title={friend.status ? 'Online' : 'Offline'} arrow>
                        <div className={`friendstatus_${friend.status }`}></div>
                    </Tooltip>
                    {
                        messageRenderContext.isTyping ? <div className="is-typing">Typing...</div> : null
                    }
                    
                </div>
                <MoreVertIcon 
                    className="remove-friend-btn" 
                    onClick={(e) => setMessageRenderContext({ menuActive : e.currentTarget })}
                />
                <Menu
                    anchorEl={messageRenderContext.menuActive}
                    open={messageRenderContext.menuActive ? true : false}
                    onClose={() => setMessageRenderContext({ menuActive : false })}
                >
                    <MenuItem onClick={() => onRemoveFriend(selectedFriend['id'])}>{ removeFriend[selectedFriend['id']] ? 'Removing...' : 'Remove' }</MenuItem>
                </Menu>
            </div>
            <div className="messages-area">
                {
                    selectedFriend?.Messages.length > 0 ?
                      messages
                    :
                    <div className="no-messages-f">
                        <img src={noMessages} />
                        <div>Oops no conversations found!</div>
                    </div>
                }
            </div>
            <div className="send-message-area">
                <TextField 
                    id="outlined-basic" 
                    variant="outlined" 
                    rowsMax={2} 
                    multiline
                    placeholder="Type a message"
                    className="text-msg-inp"
                    value={messageRenderContext.value}
                    onChange={typed}    
                />
                <button className="default-input" onClick={() => message()}>Send</button>
            </div>
        </div>
        : <div className="message-area-render no-user-selected">
            <img src={selectUser} alt=""/>
            <p>Select a Friend and Start Chatting!</p>
        </div>
    )
}

function getMessages(messages: any[] = [], activeFriendId: string) {
    return messages.map((message, i) => {
        return <div className={message.targetId && message.targetId === activeFriendId || !message.targetId && message.author !== activeFriendId ? 'message-area-me' : 'message-area-friend'} key={i}>
            <p dangerouslySetInnerHTML={{__html : message.message}}></p>
        </div>
    })
}
