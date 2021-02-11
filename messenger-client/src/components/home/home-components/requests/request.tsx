import React, { useEffect, useReducer } from 'react'
import { IFriendRequestClass, IRequestSentClass } from '../../../../interfaces/data-models'
import FriendRequest from '../../../../shared/services/request.incoming'
import SentRequest from '../../../../shared/services/request.sent'
import SearchRequest from '../../../../shared/services/request.search'
import { setGlobalToggleFunc, toastMessage } from '../../../../shared/utils'
import API from '../../../../utils/server'
import RequestRender from './requestRender'
export default function Request() {
    //sent requests
    const requestContextData = {
        tab : 'sent',
        isLoading : false,
        sentRequest : new SentRequest(),
        friendRequest : new FriendRequest(),
        searchRequest : new SearchRequest()
    }
    const [requestContext, setRequestContext] = useReducer(setGlobalToggleFunc, requestContextData)
    const friendRequestData = requestContext.friendRequest as IFriendRequestClass ;
    const sentRequestData = requestContext.sentRequest as IRequestSentClass ;
    const searchRequestData = requestContext.searchRequest as IRequestSentClass ;
    function changeNav(tab : string){
        if(tab !== requestContext.tab){
            setRequestContext({ tab : tab, isLoading : !true })
            // fetchRequest(tab)
        }
    }
    function acceptFriendRequest(id : string){
        setRequestContext({ friendRequest : friendRequestData.setApproveStatus(true, id) })
        setTimeout(() => {
            toastMessage.next({ type : true, message : `Request approved` })
            setRequestContext({ friendRequest : friendRequestData.setApproveStatus(false, id, true) })
        },2000)
    }
    function rejectFriendRequest(id : string){
        setRequestContext({ friendRequest : friendRequestData.setRejectStatus(true, id) })
        setTimeout(() => {
            toastMessage.next({ type : true, message : `Request rejected` })
            setRequestContext({ friendRequest : friendRequestData.setRejectStatus(false, id, true) })
        },2000)
    }
    function sendFriendRequest(id : string){
        setRequestContext({ searchRequest : searchRequestData.setStatus(id, true) })
        setTimeout(() => {
            toastMessage.next({ type : true, message : `Friend request sent` })
            setRequestContext({ searchRequest : searchRequestData.setStatus(id, false, true) })
        },2000)
    }
    function sentFriendRequest(id : string){
        setRequestContext({ sentRequest : sentRequestData.setStatus(id, true) })
        setTimeout(() => {
            toastMessage.next({ type : true, message : `Request revoked` })
            setRequestContext({ sentRequest : sentRequestData.setStatus(id, false, true) })
        },2000)
    }
    function searchUsers(user : string){
        setRequestContext({ searchRequest : searchRequestData.searchToggle(true) })
        setTimeout(() => {
            setRequestContext({ searchRequest : searchRequestData.searchToggle(false) })
        },2000)
    }
    async function fetchRequest(type : string) {
        try{
            const response = API.getNetwork(type)
            console.log(response)
            setRequestContext({ isLoading : false })
        }catch(e){
            setRequestContext({ isLoading : false })
            toastMessage.next({ type : false, message : e })
        }
    }
    useEffect(() => {
        // fetchRequest(requestContext.tab)
    }, [])
    return (
        <RequestRender 
            {...requestContext} 
            changeNav={changeNav}
            sentFriendRequest={sentFriendRequest}
            acceptFriendRequest={acceptFriendRequest}
            rejectFriendRequest={rejectFriendRequest}
            sendFriendRequest={sendFriendRequest}
            searchUsers={searchUsers}
        />
    )
}
