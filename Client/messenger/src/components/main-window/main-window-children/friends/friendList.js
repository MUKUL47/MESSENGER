import React, {useContext, useEffect, useState} from 'react'
import { Drawer } from '../../../../shared/components/material-ui-modules'
import { FriendListUi } from './ui/friendsListUi'
import { FriendListContext } from './friendListContext'
import { manipluateUserCall } from '../profile/requests/requestApi'
import { RequestApiContext } from '../profile/requests/requestApi'
import { SocketContext } from '../socketCommunication/socketContext'
import { globalMessages } from '../../../../shared/components/calls/server'
import * as _ from 'lodash'
export const FriendList = props =>{
  const friendContext = useContext(FriendListContext)
  const socketContext = useContext(SocketContext)
  const userId = localStorage.getItem('id')
  const [listenerActive, removeListener] = useState(null);
  const requestApiContext = useContext(RequestApiContext)
  const activeListeners = [];
  const setStatus = friends => {
    // if(listenerActive >= 2) return;
    // removeListener(listenerActive+1)

    const unsub = socketContext.eventEmitted.subscribe({ next : async resp => {
      if(resp.event === 'isOnline'){
          if(resp.params == userId) return;
          const activeFriends = friendContext.activeFriends
          activeFriends[resp.params] = activeFriends[resp.params] ? activeFriends[resp.params]+1 : 0
          friendContext.setActiveFriends({ ...friendContext.activeFriends, activeFriends })
          console.log(friendContext.activeFriends)
      }

      else if(resp.event === 'currentActiveFriends'){
        const currentActive = friendContext.activeFriends
        resp.params.forEach(user => currentActive[user.key] = 0)
        friendContext.setActiveFriends({ ...friendContext.activeFriends, currentActive })
      }

      else if(resp.event === 'offline'){
        const currentActive = friendContext.activeFriends
        delete currentActive[resp.params]
        friendContext.setActiveFriends({ ...friendContext.activeFriends, currentActive })
      }
      
      else if(resp.event == 'refreshedFriendList' && resp.params.user === userId){
          console.log('----------------------------',resp)
          refreshFriendList()
      }

      else if(resp.event == 'onNotify' && resp.params.user === userId){
        console.log(resp.event)
        globalMessages.next({ message : resp.params.message })
      }
    }})
    activeListeners.push(unsub)
    console.log('etContext.sendEvent(',friends)
    socketContext.sendEvent('online', { user : userId, friends : friends.map(user => user.userId) })
  }

  useState(() => {
    return function(){ console.log('activeListeners-',activeListeners); activeListeners.forEach(event => event.unsubscribe()) }
  })
  
  const manipulatedRequests = friends => {
    if(listenerActive) return;
    removeListener(true)
    setStatus(friends)
    // console.log('manipulatedRequests-',friends)
    // console.log('manipluateUserCall--', friendContext.data)
    const unsub = manipluateUserCall.subscribe({
      next : response => {
        console.log('manipulatedRequests-',response)
          if(response.type != 'add'){
            refreshFriendList()
          }
          socketContext.sendEvent('refreshFriendList', { userId : userId, id : response.id, type : response.type })
       if(response.type === 'respond' && response.resp === 1 || response.type === 'add'){
          const message = response.type === 'respond' && response.resp === 1 ? 'Someone accepted your friend request!' : 'Someone sent you a friend request!';
          socketContext.sendEvent('notify', { userId : userId, id : response.id, message : message })
          if(response.type === 'respond' && response.resp === 1){
            setTimeout(() => {
              const clone = {...friendContext.activeFriends}
              clone[response.id] = 0
              console.log('timerrr',clone)
              friendContext.setActiveFriends(clone)
            })
          }
        }
      }
    })
    activeListeners.push(unsub)
  }

  const refreshFriendList = async () => {
    const friends = await requestApiContext.getMyNetwork('A',0, 9999999999)
    friendContext.setData(friends.data ? friends.data.users : [])
  }

  const friendsListUi = <FriendListUi 
  setStatus = {setStatus} 
  manipulatedRequests = {manipulatedRequests}
  {...props}
  />
  return (
      <div>
        <Drawer 
          id      ='profile-drawer' 
          anchor  ='left' 
          open    = {props.isDrawer}
          onClose = {props.closeFriendListDrawer}
        >
          {friendsListUi}
        </Drawer>
        <div className="full-list">
          {friendsListUi}
        </div>
      </div>
    )
}