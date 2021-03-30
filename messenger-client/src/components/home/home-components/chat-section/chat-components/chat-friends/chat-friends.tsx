import React, { useContext, useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IResponse } from '../../../../../../interfaces/data-models';
import { MESSAGE_ACTIONS } from '../../../../../../redux/actions';
import Friend, { _Friend } from '../../../../../../shared/services/messages.reducer';
import { eventEmitter, outGoingEvents, setGlobalToggleFunc, toastMessage } from '../../../../../../shared/utils';
import API from '../../../../../../utils/server';
import { SocketContext } from '../../../../socket.context';
import ChatFriendsRender from './chat-friends-render'
export default function ChatFriends() {
    const {event, error} = useContext(SocketContext)
    const dispatch = useDispatch()
    const { friends, activeFriendId, selectedFriend, id } = useSelector((s : any) => { return {...s['messagesService'], ...s['userService']}}) 
    const contextData = {
        isLoading : false
    }
    const [chatContext, setHomeContext] = useReducer(setGlobalToggleFunc, contextData)
    async function fetchFriends(){
        setHomeContext({ isLoading : true })
        try{
            const friendResponse : IResponse = await API.getNetwork('friend', 0, 999999)
            if(friendResponse.data?.message?.length > 0){
                const profiles : IResponse = await API.getProfile(friendResponse.data?.message.map((user : any) => user.id))
                const profileResp = profiles.data?.message || []
                const users = profileResp.map((profile : any) => new _Friend().createFriend(profile.id, profile.displayName))
                if(users.length > 0){
                    dispatch({ type : MESSAGE_ACTIONS.ADD_FRIENDS, data : users })
                }
                setHomeContext({ isLoading : false })
            }else{
                // dispatch({ type : MESSAGE_ACTIONS.ADD_FRIEND, data : [] })
                setHomeContext({ isLoading : false })
            }
        }catch(e){
            setHomeContext({ isLoading : false })
            toastMessage.next({ message : e, type : false })
        }
    }
    function setActiveFriend(friendId : string){
        // if(!selectedFriend?.status){
        event.emit(outGoingEvents.ON_FRIEND_SELECT, {args : { id : id, friendId : friendId }})
        // }
        if(friendId === activeFriendId) return
        dispatch({ type : MESSAGE_ACTIONS.SET_FRIEND_ACTIVE, data : { id : friendId }})
    }
    useEffect(() => {
        if(friends.length === 0){
            fetchFriends()
        }
    },[])
    return (
        <ChatFriendsRender 
            {...chatContext} 
            activeFriend={activeFriendId} 
            friends={friends}
            setActiveFriend={setActiveFriend}
            selectedFriend={selectedFriend}
        />
    )
}
