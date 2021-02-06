import React from 'react'
import './chat-friends.scss'
///home/mukul/mukul/messenger/messenger-client/src/assets/emptyProfile.webp
import defaultPic from '../../../../../../assets/emptyProfile.webp'
export default function ChatFriendsRender() {
    return (
        <div className="ChatFriendsRender">
            <div className="search-friends">
                <p>Search</p>
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
