import React, { useEffect, useReducer } from 'react'
import { IFriendRequestClass, IRequestSentClass, IRequest } from '../../../../interfaces/data-models'
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
        searchRequest : new SearchRequest(),
        searchInput : ''
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
    async function acceptFriendRequest(id : string){
        setRequestContext({ friendRequest : friendRequestData.setRejectStatus(true, id) })
        try{
            await API.networkAction('respond', id, 'accept')
            toastMessage.next({ type : true, message : `Request approved` })
            setRequestContext({ friendRequest : friendRequestData.setRejectStatus(false, id, true) })
        }catch(e){
            toastMessage.next({ type : false, message : e })
            setRequestContext({ friendRequest : friendRequestData.setRejectStatus(false, id) })
        }
    }
    async function rejectFriendRequest(id : string){
        setRequestContext({ friendRequest : friendRequestData.setRejectStatus(true, id) })
        try{
            await API.networkAction('remove', id)
            toastMessage.next({ type : true, message : `Request rejected` })
            setRequestContext({ friendRequest : friendRequestData.setRejectStatus(false, id, true) })
        }catch(e){
            toastMessage.next({ type : false, message : e })
            setRequestContext({ friendRequest : friendRequestData.setRejectStatus(false, id) })
        }
    }
    async function sendFriendRequest(id : string){
        setRequestContext({ searchRequest : searchRequestData.setStatus(id, true) })
        try{
            await API.networkAction('send', id)
            toastMessage.next({ type : true, message : `Friend request sent` })
            setRequestContext({ searchRequest : searchRequestData.setStatus(id, false) })
        }catch(e){
            toastMessage.next({ type : false, message : e })
            setRequestContext({ searchRequest : searchRequestData.setStatus(id, false) })
        }
    }
    async function cancelFriendRequest(id : string){
        setRequestContext({ sentRequest : sentRequestData.setStatus(id, true) })
        try{
            await API.networkAction('remove', id)
            toastMessage.next({ type : true, message : `Request revoked` })
            setRequestContext({ sentRequest : sentRequestData.setStatus(id, false, true) })
        }catch(e){
            setRequestContext({ sentRequest : sentRequestData.setStatus(id, false) })
            toastMessage.next({ type : false, message : e })
        }
    }
    async function searchUsers(user ?: string){
        const isFirstTime = requestContextData.searchInput.trim().length === 0;
        const combines = {
            func : ['searchToggle', user ? 'resetCount' : 'incrementCount', isFirstTime ? 'setSearch' : ''],
            args : [[true],[],[]] 
        }
        setRequestContext({ searchRequest : searchRequestData.combineAll(combines.func, combines.args), isLoading : true })
        try{
            const response = await API.searchUsers(user || requestContextData.searchInput, searchRequestData.pages.start, searchRequestData.pages.count)
            const users = response?.data?.message || [];
            const c : any = {
                f : ['searchToggle'],
                a : [[false]]
            }
            if(response?.data?.message.length > 0){
                c.f.push('addRequests')
                c.a.push([users])
            }
            setRequestContext({ searchRequest : searchRequestData.combineAll(c.f, c.a), isLoading : false})
        }catch(e){
            toastMessage.next({ type : false, message : e })
            setRequestContext({ searchRequest : searchRequestData.searchToggle(false), isLoading : false })
        }
    }
    async function fetchRequest() {
        setRequestContext({ isLoading : false })
        try{
            if(requestContext.tab === 'sent'){
                const networkResp = await API.getNetwork('sent', sentRequestData.pages.start, sentRequestData.pages.count)
                const ids = networkResp?.data?.message || [];
                if(ids.length > 0){
                    const profiles = (await API.getProfile(ids.map((i : any) => i.id)))?.data?.message || []
                    setRequestContext({ isLoading : false, sentRequest : sentRequestData.addRequests(profiles) })
                    return
                }
                setRequestContext({ isLoading : false, sentRequest : sentRequestData.resetRequests()  })
            }else{
                const networkResp = await API.getNetwork('requests', friendRequestData.pages.start, friendRequestData.pages.count)
                const ids = networkResp?.data?.message || [];
                if(ids.length > 0){
                    const profiles = (await API.getProfile(ids.map((i : any) => i.id)))?.data?.message || []
                    setRequestContext({ isLoading : false, friendRequest : friendRequestData.addRequests(profiles) })
                    return
                }
                setRequestContext({ isLoading : false, friendRequest : friendRequestData.resetRequests() })
            }
        }catch(e){
            // toastMessage.next({ type : false, message : e })
            setRequestContext({ isLoading : false })
        }
    }
    useEffect(() => {
        fetchRequest()
    }, [])
    useEffect(() => {
        if(requestContext.tab === 'sent' || requestContext.tab === 'requests'){
            fetchRequest()
        }
    }, [requestContext.tab])
    return (
        <RequestRender 
            {...requestContext} 
            changeNav={changeNav}
            cancelFriendRequest={cancelFriendRequest}
            acceptFriendRequest={acceptFriendRequest}
            rejectFriendRequest={rejectFriendRequest}
            sendFriendRequest={sendFriendRequest}
            searchUsers={searchUsers}
        />
    )
}
