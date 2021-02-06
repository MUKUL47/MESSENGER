import React from 'react'
import ChatFriends from './chat-components/chat-friends/chat-friends'
import MessageAreaRender from './chat-components/message-area/message-area.render'
import './chat.scss'
export default function ChatRender() {
    return (
        <div className="chat-render">
            <div className="chat-render--chatfriends">
                <ChatFriends/>
            </div>
            <div className="chat-render--messagearea">
                <MessageAreaRender/>
            </div>
        </div>
    )
}
