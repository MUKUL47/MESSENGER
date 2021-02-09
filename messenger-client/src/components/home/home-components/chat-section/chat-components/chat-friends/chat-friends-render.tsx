import React from 'react'
import './chat-friends.scss'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import { ArrowBackIosIcon } from '../../../../../../shared/material-modules'
export default function ChatFriendsRender() {
    return (
        <div className="ChatFriendsRender">
            <div className="search-friends">
                <div className="search-chat-bar">
                    <p>Search</p>
                    <div className="hide-friends">
                        <ArrowBackIosIcon onClick={() => {
                            window.document?.getElementById('chat-friends')?.classList?.remove('chat-render-showFriends')
                        }}/>
                    </div>
                </div>
                <input type="text" className="default-input" placeholder="Enter Friend Name..."/>
            </div>
            <div className="chat-friends-circle">
                {
                    Array(23).fill(1).map(() => {
                        return <div className="friend-circle">
                        <div className="friend-image">
                            <img className="d_ps" src={defaultPic} alt="Mukul"/>
                        </div>
                        <div className="friend-name">
                            Mukul Dutt
                        </div>
                        <div className="friend-status"></div>
                    </div>
                    })
                }
            </div>
        </div>
    )
}
