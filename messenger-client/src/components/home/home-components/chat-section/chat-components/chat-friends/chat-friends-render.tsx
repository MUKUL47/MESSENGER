import React, { createRef, useMemo, useReducer } from 'react'
import './chat-friends.scss'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import noFriends from '../../../../../../assets/no-friends.svg'
import { ArrowBackIosIcon, CircularProgress } from '../../../../../../shared/material-modules'
import { setGlobalToggleFunc } from '../../../../../../shared/utils'
import { IFriend } from '../../../../../../interfaces/data-models'
export default function ChatFriendsRender(props : any) {
    const {
        isLoading,
        friends,
        setActiveFriend,
        activeFriend,
        selectedFriend,
        addedMessage
    } = props;
    const searchRef : any = createRef()
    const [chatRenderContext, setChatRenderContext] = useReducer(setGlobalToggleFunc, { searchedFriends : '' })
    const lastMessages = useMemo(() => {
        return (friends || []).map((friend : IFriend) => {
            const messages = friend?.Messages || [{ message : false }];
            return {message : messages[messages.length - 1]?.message, newMessageCount : addedMessage[friend.id]};
        })
    },[addedMessage])
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
                    friends.map((f : any, i : number) => {
                        return chatRenderContext.searchedFriends.trim().length === 0 || f.name.toLowerCase().includes(chatRenderContext.searchedFriends.trim()) ?
                        <div className={f.id === activeFriend ? 'friend-circle f-c-selected' : 'friend-circle'} key={f.id} onClick={() => setActiveFriend(f.id)}>
                            <div className="friend-image">
                                <img className="d_ps" src={defaultPic} alt={f.name}/>
                            </div>
                            <div className="friend-name">
                                <p>{f.name}</p>
                                {
                                    lastMessages[i]?.message ? 
                                        <p className={`friend__message ${lastMessages[i]?.newMessageCount ? 'friend__message-active' : ''}`}>{lastMessages[i]?.message}</p> 
                                    : null
                                }
                            </div>
                            {
                                lastMessages[i]?.newMessageCount ? 
                                    <div className="new-messagecount">
                                        {lastMessages[i]?.newMessageCount > 99 ? '99+' : lastMessages[i]?.newMessageCount}
                                    </div> 
                                : null
                            }
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
