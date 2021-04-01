import React, { createRef, useReducer } from 'react'
import './chat-friends.scss'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import noFriends from '../../../../../../assets/no-friends.svg'
import { ArrowBackIosIcon, CircularProgress } from '../../../../../../shared/material-modules'
import { setGlobalToggleFunc } from '../../../../../../shared/utils'
export default function ChatFriendsRender(props : any) {
    const {
        isLoading,
        friends,
        setActiveFriend,
        activeFriend,
        selectedFriend
    } = props;
    const searchRef : any = createRef()
    const [chatRenderContext, setChatRenderContext] = useReducer(setGlobalToggleFunc, { searchedFriends : '' })
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
                <div className="search-input">
                    <input ref={searchRef} disabled={friends.length === 0} onKeyUp={(e : any) => setChatRenderContext({ searchedFriends : e.target.value.toLowerCase() })} type="text" className="default-input" placeholder="Enter Friend Name..."/>
                    {chatRenderContext.searchedFriends.trim().length > 0 ? 
                        <div className="close-btn" onClick={() => {
                            setChatRenderContext({ searchedFriends :'' });
                            searchRef.current.value = '';
                        }}>
                            x
                        </div> : null}
                </div>
            </div>
            <div className="chat-friends-circle">
                {
                    friends.map((f : any) => {
                        return chatRenderContext.searchedFriends.trim().length === 0 || f.name.toLowerCase().includes(chatRenderContext.searchedFriends.trim()) ?
                        <div className={f.id === activeFriend ? 'friend-circle f-c-selected' : 'friend-circle'} key={f.id} onClick={() => setActiveFriend(f.id)}>
                        <div className="friend-image">
                            <img className="d_ps" src={defaultPic} alt="Mukul"/>
                        </div>
                        <div className="friend-name">
                            {f.name}
                        </div>
                        <div className="friend-status"></div>
                    </div> : null
                    })
                }
                <>
                {
                    isLoading || friends.length === 0?
                    <div className="loading-friends">
                    {
                        isLoading ?
                        <>
                            <CircularProgress/>
                            <p>Loading Friends</p>
                        </>:
                        friends.length === 0 ?
                        <>
                            <img src={noFriends}/>
                            <p>No Friends Found</p>
                        </>:null
                    }
                    </div>:null
                }
                </>
            </div>
        </div>
    )
}
