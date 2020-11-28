import React, {useContext, useState, useEffect} from 'react'
import { FriendListContext } from '../friends/friendListContext'
import { ProfileChatArea } from './userProfile&ChatArea/profileChatArea'
import './defaultChatArea.scss'
import noChatArea from '../../../../assets/images/chat-area-empty.jpeg'
import fetchingFriendList from '../../../../assets/images/fetching-friend-list.gif'
export const DefaultChatArea = props => {
  const friendListContext = useContext(FriendListContext);
  const [fetchingList, setFetchingList] = useState({times : 0, dot : ''})
  const selectedFriend = friendListContext.selectedFriendInChat.get;
  const isThere = selectedFriend
  const friend = isThere ? selectedFriend.name : false
  const bgBlack = friend ? '' : ' noFriends-bg-black';
  useEffect(() => {
    if(isThere) return;
    const timer = setTimeout(() => {
      const times = fetchingList.times+1
      const dots = Array(times % 4).fill(true).map(_ => '.').join('')
      setFetchingList({times : times, dot : dots})
    }, 1000)
    return function(){
      clearTimeout(timer)
    }
  },[fetchingList])
        return (
          <div className={'DefaultChatArea'+bgBlack}>
            { !isThere ? fetchingFriends(fetchingList) : friend ? <ProfileChatArea/> : noFriends() }
          </div>
        )
}

const fetchingFriends = friend => {
  return (
    <div>
      <div className='fetchingFriends-text'>Fetching Friends{friend.dot}</div>
      {/* <img src={fetchingFriendList} className="fetching-friend-icon"/> */}
    </div>
  )
}

const noFriends = () => {
  return (
    <div>
      <div className='noFriends-text'>No Friends</div>
      <div className='noFriends'>
        <img src = {noChatArea} className="no-friends"/>
      </div>
    </div>
  )
}