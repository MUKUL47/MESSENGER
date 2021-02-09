import React, { useState } from 'react'
import { SearchIcon, QueryBuilderIcon, Pagination, SendIcon, CheckCircleOutlineIcon, CancelIcon, TextField } from '../../../../shared/material-modules'
import './request.scss'
import emptyProfile from '../../../../assets/emptyProfile.webp'
export default function RequestRender() {
    const [requestNav, setRequestNav] = useState<number>(1)
    return (
        <div className="request-render">
            <div className="request-render--nav">
                <div className={requestNav === 1 ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => setRequestNav(1)}>
                    <SendIcon/>
                    <span>Sent Requests</span>
                </div>
                <div className={requestNav === 2 ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => setRequestNav(2)}>
                    <SearchIcon/>
                    <span>Search</span>
                </div>
                <div className={requestNav === 3 ? 'request-nav-item request-active-nav' : 'request-nav-item'} onClick={() => setRequestNav(3)}>
                    <QueryBuilderIcon/>
                    <span>Pending Requests</span>
                </div>
            </div>
            <div className="request-content">
                { requestNav === 1 ? <SentRequests/> : null }
                { requestNav === 2 ? <>
                    <TextField className="request-search-inp" id="outlined-basic" variant="outlined" placeholder="Enter User"/>
                    <SearchRequests/>
                </> : null }
                { requestNav === 3 ? <PendingRequests/> : null }
            </div>
        </div>
    )
}

function SentRequests(){
    return(
        <div className="request-content--SentRequests">
           {
               Array(212).fill(1).map(v => {
                   return (
                        <div className="sentrequests-item">
                        <div className="request-profile">
                            <div className="requestitem-profile">
                                <img src={emptyProfile} />
                            </div>
                            <div className="requestitem-profilename">
                                Mukul Dutt
                            </div>
                        </div>
                        <div className="requestitem-actions">
                            <button>
                                <CancelIcon/>
                                <span>Revoke</span>
                            </button>
                        </div>
                    </div>
                   )
               })
           }
        </div>
    )
}

function SearchRequests(){
    return(
        <div className="request-content--SentRequests request-content--SentRequests-min">
           {
               Array(122).fill(1).map(v => {
                   return (
                        <div className="sentrequests-item">
                        <div className="request-profile">
                            <div className="requestitem-profile">
                                <img src={emptyProfile} />
                            </div>
                            <div className="requestitem-profilename">
                                Mukul Dutt
                            </div>
                        </div>
                        <div className="requestitem-actions">
                            <button className="send-r-btn">
                                <SendIcon/>
                                <span>Send Request</span>
                            </button>
                        </div>
                    </div>
                   )
               })
           }
        </div>
    )
}

function PendingRequests(){
    return(
        <div className="request-content--SentRequests">
           {
               Array(12).fill(1).map(v => {
                   return (
                        <div className="sentrequests-item">
                        <div className="request-profile">
                            <div className="requestitem-profile">
                                <img src={emptyProfile} />
                            </div>
                            <div className="requestitem-profilename">
                                Mukul Dutt
                            </div>
                        </div>
                        <div className="requestitem-actions">
                            <button className="accept-r-btn">
                                <CheckCircleOutlineIcon/>
                                <span>Accept</span>
                            </button>
                            <button className="reject-r-btn">
                                <CancelIcon/>
                                <span>Reject</span>
                            </button>
                        </div>
                    </div>
                   )
               })
           }
        </div>
    )
}