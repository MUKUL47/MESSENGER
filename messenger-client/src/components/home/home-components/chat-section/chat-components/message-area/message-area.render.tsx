import React, { useEffect, useMemo, useReducer } from 'react'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import './message-area.scss'
import { Menu, MenuItem, MoreVertIcon, TextField } from '../../../../../../shared/material-modules'
import selectUser from '../../../../../../assets/select-user.svg'
import noMessages from '../../../../../../assets/no-messages.svg'
import { setGlobalToggleFunc } from '../../../../../../shared/utils'
import { IMessage } from '../../../../../../interfaces/data-models'

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
        addedMessage
    } = props;
    const renderContextData = {
        menuActive: false,
        value: ''
    }
    const [messageRenderContext, setMessageRenderContext] = useReducer(setGlobalToggleFunc, renderContextData);
    const messages = useMemo(() => {
        return getMessages(friend.Messages, activeFriend)
     }, [friend, addedMessage])
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
                    selectedFriend.Messages.length > 0 ?
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
                    onChange={(e) => setMessageRenderContext({value : e.target.value})}    
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

function getMessages(messages: IMessage[] = [], activeFriendId: string) {
    console.log(messages)
    return messages.map((message, i) => {
        return <div className={message.ownerId === activeFriendId ? 'message-area-me' : 'message-area-friend'} key={i}>
            <p dangerouslySetInnerHTML={{__html : message.message}}></p>
        </div>
    })
}
