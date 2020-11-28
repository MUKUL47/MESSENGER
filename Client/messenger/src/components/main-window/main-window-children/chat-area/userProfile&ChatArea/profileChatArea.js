import React, {useContext, useState} from 'react'
import { ChatArea } from './chatArea/chatArea'
import { ProfileArea } from './profileArea/profileArea'
import './profileChatArea.scss'
import { ChatAreaContext } from './chatArea/chatAreaContext'
export const ProfileChatArea = props => {
    const chatAreaContext = useContext(ChatAreaContext)
    return (
        <div className="ProfileChatArea">
            {/* <div className='profile-modal'> */}
            <ChatAreaContext>
                <ProfileArea/>
                <ChatArea/>
            </ChatAreaContext>
            {/* </div> */}
        </div>
    )
}