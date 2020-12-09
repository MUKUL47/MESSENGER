import React, { useEffect, useReducer, useState } from 'react';
import profileImg from '../../../../assets/emptyProfile.webp'
import { Button, ThumbUpIcon, ThumbDownIcon, CircularProgress, SendIcon, CancelIcon, QueryBuilderIcon, SearchIcon, TextField, CloseIcon, PersonIcon } from '../../../../shared/material-modules';
import { setGlobalToggleFunc } from '../../../../shared/utils';
import './requests.scss'
export default function RequestRenderer(props: any) {
    const { requestData, isLoading, changeNav, searchAns, revokeSentReq, respondApproval } = props;
    const [nav, setNav] = useState<number>(1);
    const [search, setSearch] = useReducer(setGlobalToggleFunc, { val: '', onSearch: false })
    const [inQueue, setQueue] = useState<string[]>([]);
    const change = (n: number) => {
        if (nav === n) return;
        setNav(n)
        changeNav(n);
    };
    const searchChange = (evt: any) => {
        if (evt.code === "Enter" && evt.target.value.trim().length > 0) {
            setSearch({ onSearch: true })
            changeNav(nav, evt.target.value);
        }
    }
    useEffect(() => {
        console.log(requestData.requestInQueue.id)
        if (requestData.requestInQueue.op === 'add') {
            setQueue([...inQueue, requestData.requestInQueue.id])
        } else {
            const q = [...inQueue];
            const idx = q.findIndex(v => v === requestData.requestInQueue.id);
            if (idx > -1) {
                q.splice(idx, 1);
                setQueue(q)
            }
            setQueue(q);
        }
    }, [requestData.requestInQueue]);
    const data = (getRequestType(requestData, nav) || []);
    return (
        <>
            <div className="request-layout" >
                <div className="request-layout-nav">
                    <div id={nav === 1 ? 'nav__active' : ""} onClick={() => change(1)}>
                        Sent Requests
                        {
                            nav === 1 && isLoading ?
                                <GetLoadingTemplate /> :
                                <SendIcon />
                        }
                    </div>
                    <div id={nav === 2 ? 'nav__active' : ""} onClick={() => change(2)}>
                        Search
                        {
                            nav === 2 && isLoading ?
                                <GetLoadingTemplate /> :
                                <SearchIcon />
                        }
                    </div>
                    <div id={nav === 3 ? 'nav__active' : ""} onClick={() => change(3)}>
                        Pending Requests

                        {
                            nav === 3 && isLoading ?
                                <GetLoadingTemplate /> :
                                <QueryBuilderIcon />
                        }
                    </div>
                </div>
                {
                    <div className="requests-lay">
                        {nav === 2 ?
                            <div className="search-bar">
                                <SearchIcon />
                                <TextField placeholder="Search Users"
                                    onChange={e => setSearch({ val: e.target.value })}
                                    onKeyDown={e => searchChange(e)}
                                    value={search.val}
                                />
                            </div>
                            : null}
                        {

                            !isLoading && data.length === 0 ?
                                <div className="requests-lay">
                                    {noResultTemplate(nav)}
                                </div> :
                                data.map((v: any, i: number) => {
                                    // if (v.response?.responseType || v.response?.responseType.response.substring(0, 2) !== 'A@') {
                                    return <div className="r-lay-request" key={i}>
                                        <div className="r-lay--profile">
                                            <img src={`${v.image}` === 'null' || v.image == 'undefined' ? profileImg : v.image} alt={v.name} />
                                            <div>{v.name}</div>
                                        </div>
                                        <div>{new Date().toDateString()}</div>
                                        <div className="r-lay--actions">
                                            {
                                                usersListActions(nav, v)
                                            }
                                        </div>
                                    </div>
                                    // }
                                })
                        }
                    </div>
                }
            </div>
        </>
    );


    function usersListActions(type: any, user: any) {
        const inQ = inQueue.find((v: string) => v === user.id || user.userId);
        const isRevoke = user.responseType?.response.substring(0, 2) === 'P@';
        const respondQ = type === 3 ? inQueue.find((v: string) => v === user.userId + "_0" || user.userId + "_1") : null;
        const isA = respondQ?.split('_1').length === 2;
        switch (type) {
            case 3: return <>
                <Button
                    className="r-lay--action__accept"
                    onClick={() => respondApproval(user.userId, 1, user.name)}
                >
                    <div id='search-req'>{respondQ && isA ? 'Accepting' : 'Accept'}</div>
                    {respondQ && isA ? <GetLoadingTemplate /> : <ThumbUpIcon />}
                </Button>
                <Button
                    className="r-lay--action__reject"
                    onClick={() => respondApproval(user.userId, 0, user.name)}
                >
                    <div id='search-req'>{respondQ && !isA ? 'Rejecting' : 'Reject'}</div>
                    {respondQ && !isA ? <GetLoadingTemplate /> : <ThumbDownIcon />}
                </Button>
            </>
            case 1: return <Button className="r-lay--action__reject"
                onClick={() => revokeSentReq(user.id || user.userId, user.name)}
                disabled={inQ ? true : false}
            >
                <div id='search-req'>{inQ ? 'Revoking' : 'Revoke'}</div>
                {
                    inQ ? <GetLoadingTemplate /> : <CloseIcon />
                }
            </Button>

            case 2: return <>
                <div className="r-lay-search">
                    <Button
                        className="r-lay--action__send"
                        onClick={() => searchAns(user.id, user.name, !isRevoke ? 'add' : 'revoke')}
                        disabled={inQ ? true : false}
                    >
                        {
                            isRevoke ?
                                <>
                                    <div id='search-req'>{inQ ? 'Revoking' : 'Revoke'}</div>
                                    {
                                        inQ ? <GetLoadingTemplate /> : <CancelIcon />
                                    }
                                </> :
                                <>
                                    <div id='search-req'>{inQ ? 'Sending' : 'Send Request'}</div>
                                    {
                                        inQ ? <GetLoadingTemplate /> : <SendIcon />
                                    }
                                </>

                        }
                    </Button>
                </div>
            </>
        }
    }
}

function noResultTemplate(type: number) {
    return <div className="no-result">{getRequestType({}, type, true)}</div>
}

function GetLoadingTemplate() {
    const [dots, setDots] = useState(1);
    useEffect(() => { setTimeout(() => setDots((dots + 1) % 4), 1000) }, [dots]);
    return <>{Array(dots).fill(true).map(v => '.').join('')}</>
}

function getRequestType(data: any, type: number, str?: boolean): any[] {
    if (type === 1) return str ? 'No sent requests. Yet' : data['sent']
    if (type === 2) return str ? 'No users found' : data['search']
    return str ? 'No pending requests. Yet' : data['pending']
}