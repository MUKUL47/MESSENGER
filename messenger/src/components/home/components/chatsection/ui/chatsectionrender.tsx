import React from 'react';
import ChatArea from '../chatarea/chatarea';
import Friends from '../friends/friends';
import './chatsection.scss'
export default function ChatSectionRender() {
    return (
    <div className="chatsection-layout">
        <div className="friends">
            <Friends/>
        </div>
        <div className="chat">
            <ChatArea/>
        </div>
    </div>)
}