import React, { useState } from 'react'
import { SearchIcon, QueryBuilderIcon, Pagination, SendIcon, CheckCircleOutlineIcon, CancelIcon, TextField, CircularProgress } from '../../../../shared/material-modules'
import './request.scss'
import emptyProfile from '../../../../assets/emptyProfile.webp'
import { IFriendRequest, IRequestSent, ISearchRequest } from '../../../../interfaces/data-models';
export default function RequestRender(props : any) {
    const { 
        tab, 
        isLoading, 
        sentRequest, 
        changeNav, 
        sentFriendRequest, 
        friendRequest, 
        acceptFriendRequest, 
        rejectFriendRequest,
        searchRequest,
        sendFriendRequest,
        searchUsers
    } = props;
    const [searchInp, setSearchInp] = useState<string>('')
    function onSearchKeyDown(e : any){
        if (e.key === 'Enter' && searchInp.trim().length > 0) {
            searchUsers(searchInp)
            setSearchInp('')
        }
    }
    return (
        <div className="request-render">
            <div className="request-render--nav">
                <div className={tab === 'sent' ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => changeNav('sent')}>
                    <SendIcon/>
                    <span>Sent Requests</span>
                </div>
                <div className={tab === 'search' ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => changeNav('search')}>
                    <SearchIcon/>
                    <span>Search</span>
                </div>
                <div className={tab === 'requests' ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => changeNav('requests')}>
                    <QueryBuilderIcon/>
                    <span>Pending Requests</span>
                </div>
            </div>
            <div className="request-content">
                {
                    !isLoading ?
                        tab === 'sent'? <SentRequests {...props}/> :
                        tab === 'search' ? <>
                            <TextField 
                                className="request-search-inp" 
                                id="outlined-basic" 
                                variant="outlined" 
                                placeholder="Enter User"
                                onKeyDown={onSearchKeyDown}
                                value={searchInp}
                                onChange={(e) => setSearchInp(e.target.value)}
                            />
                            <SearchRequests {...props}/>
                        </> :  
                        tab === 'requests' ? <PendingRequests {...props}/> : null 
                    : <p className="_loading">Loading...</p>
                }
            </div>
        </div>
    )
}

function SentRequests(props : any){
    const { sentRequest, sentFriendRequest } = props;
    const totalRequests = sentRequest.getRequests() || [];
    return(
                totalRequests.length > 0 ?
                <div className="request-content--SentRequests">
            {totalRequests.map((request : IRequestSent) => {
                return (
                        <div className="sentrequests-item">
                            <div className="request-profile">
                                <div className="requestitem-profile">
                                    <img src={emptyProfile} />
                                </div>
                                <div className="requestitem-profilename">
                                    {request.name}
                                </div>
                            </div>
                            <div className="requestitem-actions">
                                <button disabled={request.isRevoking} 
                                        onClick={() => sentFriendRequest(request.id)}
                                >
                                    {
                                        !request.isRevoking ?
                                        <CancelIcon/> :
                                            null
                                        // <div className="progress-request">
                                        //     <CircularProgress color="inherit" />
                                        // </div>
                                    }
                                    <span>{request.isRevoking ? '...' : 'Revoke'}</span>
                                </button>
                            </div>
                        </div>
                )
            })}
        </div>
            :
            <div className="no-sent-req">
            No Sent Request found
            </div>
    )
}

function SearchRequests(props : any){
    const { searchRequest, sendFriendRequest} = props;
    const totalRequests = searchRequest.getRequests() || [];
    return(
        !searchRequest.isSearching() ?
        totalRequests.length > 0 ?
        <div className="request-content--SentRequests request-content--SentRequests-min">
           {
               totalRequests.map((user : ISearchRequest) => {
                   return (
                        <div className="sentrequests-item">
                        <div className="request-profile">
                            <div className="requestitem-profile">
                                <img src={emptyProfile} />
                            </div>
                            <div className="requestitem-profilename">
                                {user.name}
                            </div>
                        </div>
                        <div className="requestitem-actions">
                            <button className="send-r-btn" 
                                disabled={user.sending} 
                                onClick={() => sendFriendRequest(user.id)}>
                                <SendIcon/>
                                <span>{user.sending ? 'Sending...' : 'Send Request'}</span>
                            </button>
                        </div>
                    </div>
                   )
               })
           }
        </div>
            :
            <div className="no-sent-req">
            No User Found
            </div> : 
            <div className="no-sent-req">
            Searching...
            </div>
    )
}

function PendingRequests(props : any){
    const { friendRequest, acceptFriendRequest, rejectFriendRequest } = props;
    const totalRequests = friendRequest.getRequests() || [];
    return(
        totalRequests.length > 0 ?
        <div className="request-content--SentRequests">
           {
               totalRequests.map((request : IFriendRequest)  => {
                   return (
                        <div className="sentrequests-item">
                        <div className="request-profile">
                            <div className="requestitem-profile">
                                <img src={emptyProfile} />
                            </div>
                            <div className="requestitem-profilename">
                                {request.name}
                            </div>
                        </div>
                        <div className="requestitem-actions">
                            <button className="accept-r-btn"
                                disabled={request.isRejecting || request.isApproving}
                                onClick={() => acceptFriendRequest(request.id)}
                            >
                                <CheckCircleOutlineIcon/>
                                <span>{request.isApproving ? 'Accepting...' : 'Accept'}</span>
                            </button>
                            <button className="reject-r-btn"
                                disabled={request.isRejecting || request.isApproving}
                                onClick={() => rejectFriendRequest(request.id)}
                            >
                                <CancelIcon/>
                                <span>{request.isRejecting ? 'Reject...' : 'Reject'}</span>
                            </button>
                        </div>
                    </div>
                   )
               })
           }
        </div>
        :
        <div className="no-sent-req">
        No Friend Request found
        </div>
    )
}