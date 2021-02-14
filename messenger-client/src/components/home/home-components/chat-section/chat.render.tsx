import React, { createRef, useState } from 'react'
import ChatFriends from './chat-components/chat-friends/chat-friends'
import MessageArea from './chat-components/message-area/message-area'
import MessageAreaRender from './chat-components/message-area/message-area.render'
import './chat.scss'
export default function ChatRender() {
    const [friendRef, setFriendRef] = useState<any>(createRef())
    return (
        <div className="chat-render">
            <div className="chat-render--chatfriends" id='chat-friends' ref={friendRef}>
                <ChatFriends/>
            </div>
            <div className="chat-render--chatfriends-mob" onClick={() => friendRef.current.classList.toggle('chat-render-showFriends')}>
                <div>F</div>
                <div>R</div>
                <div>I</div>
                <div>E</div>
                <div>N</div>
                <div>D</div>
                <div>S</div>
            </div>
            <div className="chat-render--messagearea">
                <MessageArea/>
            </div>
        </div>
    )
}
