import React, { useState, useContext, useEffect } from 'react'
import {
    TextField,
    InputAdornment,
    SearchIcon,
    defaultProfile,
    CircularProgress
} from '../../../../../shared/components/material-ui-modules'
import { checkSubStrMatch } from '../../../../../shared/components/utils/short'
import './friendsListUi.scss'
import { FriendListContext } from '../friendListContext'
import { RequestApiContext } from '../../profile/requests/requestApi'
import { SocketContext } from '../../socketCommunication/socketContext'
export function FriendListUi(props) {
    const friendContext = useContext(FriendListContext)
    const requestApiContext = useContext(RequestApiContext)
    const socketContext = useContext(SocketContext)
    useEffect(() => {
        console.log('ready--', socketContext)
        if (!socketContext.sendEvent) return;
        if (!friendContext.isFetching) {
            (async function () {
                try {
                    friendContext.setFetch()
                    const friends = await requestApiContext.getMyNetwork('A', 0, 9999999999)
                    const userss = friends.data ? friends.data.users : []
                    friendContext.selectedFriendInChat.set(userss[0] ? userss[0] : {})
                    friendContext.setData(userss)
                    props.manipulatedRequests(userss)
                } catch (ee) {
                    friendContext.selectedFriendInChat.set([])
                    friendContext.setData([])
                }
            }())
        }
    }, [socketContext.socket])

    // useEffect(() => {
    //     console.log('friendContext.data--',friendContext.data, socketContext.socket)
    //     if(friendContext.data && socketContext.socket){
    //         props.manipulatedRequests(friendContext.data)
    //         // props.setStatus(friendContext.data)
    //     }
    //     console.log(friendContext)
    // },[friendContext.data, socketContext.socket])

    const onSearchChange = e => {
        const val = e.target.value;
        const isEmpty = val.trim().length === 0
        if (isEmpty) {
            friendContext.SetFiltered(friendContext.data)
            return;
        }
        const pending = friendContext.data.filter(user => checkSubStrMatch(val, user.name))
        friendContext.SetFiltered(pending)
    }

    const selectFriend = user => {
        console.log(user)
        friendContext.selectedFriendInChat.set(user)
        if (props.isDrawer) {
            props.closeFriendListDrawer()
        }
    }

    return (
        <div className="parent-friendsUi">
            <div className="parent-border">
                <div className="search-bar-">
                    <TextField
                        // disabled = {!friendContext.filtered || friendContext.filtered.length === 0}
                        onChange={onSearchChange}
                        className='search-bar'
                        placeholder="Search chat"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div className='friends-list'>

                    {friendContext.filtered ?
                        (
                            !friendContext.filtered || friendContext.data.length === 0 ?
                                <div>
                                    <b>You have no friends!</b>
                                </div>
                                :
                                friendContext.filtered.map((user, i) => {
                                    const sUser = friendContext.selectedFriendInChat.get;
                                    const selected = `friend-card ${sUser && sUser.userId === user.userId ? 'friend-card-selected' : ''}`
                                    return <div className={selected} key={i} onClick={e => selectFriend(user)}>
                                        <div className="friend-card-pic">


                                            {!user.image ?
                                                <div id='profileDisplayNname'>
                                                    <p id='p-profileName'>
                                                        {user.name.substring(0, 1).toUpperCase()}
                                                    </p>
                                                </div>
                                                :
                                                <img id='profile_img' src={user.image} />
                                            }

                                        </div>
                                        <div className="friend-card-name">
                                            {user.name}
                                        </div>
                                        <div className="friend-status">
                                            <div id='status' className={friendContext.activeFriends[user.userId] >= 0 ? 'active' : 'offline'}>
                                            </div>
                                        </div>
                                    </div>
                                }
                                )
                        )
                        :
                        <div className="fetching-content">
                            <div>
                                <CircularProgress />
                                <div>
                                    <b>Loading Friends...</b>
                                </div>
                            </div>
                        </div>}

                </div>
            </div>
        </div>)
}