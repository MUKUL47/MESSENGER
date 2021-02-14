import React, { useEffect, useReducer } from 'react'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import './message-area.scss'
import { Menu, MenuItem, MoreVertIcon, TextField } from '../../../../../../shared/material-modules'
import selectUser from '../../../../../../assets/select-user.svg'
import noMessages from '../../../../../../assets/no-messages.svg'
import { setGlobalToggleFunc } from '../../../../../../shared/utils'

export default function MessageAreaRender(props : any) {
    const {
        isLoading,
        friends,
        activeFriend,
        selectedFriend,
        removeFriend,
        onRemoveFriend
    } = props;
    const renderContextData = {
        menuActive : false
    }
    const [messageRenderContext, setMessageRenderContext] = useReducer(setGlobalToggleFunc, renderContextData)
    useEffect(() => {
        setMessageRenderContext({menuActive : false})
    },[activeFriend])
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
                       <>
                            <div className='message-area-me'>
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing
                                </p>
                            </div>
                            <div className="message-area-friend">
                                <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing
                                </p>
                            </div>
                        </>
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
                />
                <button className="default-input">Send</button>
            </div>
        </div>
        : <div className="message-area-render no-user-selected">
            <img src={selectUser} alt=""/>
            <p>Select a Friend and Start Chatting!</p>
        </div>
    )
}
