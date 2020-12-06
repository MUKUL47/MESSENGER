import React, { useContext, useEffect, useReducer, useState } from 'react';
import profileImg from '../../../../assets/namaste.png'
import { Button, ThumbUpIcon, ThumbDownIcon, CircularProgress, SendIcon, CancelIcon, QueryBuilderIcon, SearchIcon, TextField } from '../../../../shared/material-modules';
import { setGlobalToggleFunc } from '../../../../shared/utils';
import './requests.scss'
export default function RequestRenderer(props: any) {
    const { requestData, isLoading, changeNav } = props;
    const [nav, setNav] = useState(1);
    const [search, setSearch] = useState('');
    const change = (n: number) => {
        if (nav === n) return;
        setSearch('')
        setNav(n)
        changeNav(n);
    };
    const searchChange = (evt: any) => {
        if (evt.code === "Enter") {
            changeNav(nav, evt.target.value);
        }
    }
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
                <div className="requests-lay">
                    {nav === 2 ?
                        <div className="search-bar">
                            <SearchIcon />
                            <TextField placeholder="Search Users"
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={e => searchChange(e)}
                                value={search}
                            />
                        </div>
                        : null}
                    {
                        (getRequestType(requestData, nav) || []).map((v: any, i: number) => {
                            return <div className="r-lay-request" key={i}>
                                <div className="r-lay--profile">
                                    <img src={profileImg} />
                                    <div>{v.name}</div>
                                </div>
                                <div>{new Date().toDateString()}</div>
                                <div className="r-lay--actions">
                                    {usersListActions(nav)}
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

function GetLoadingTemplate() {
    const [dots, setDots] = useState(1);
    useEffect(() => { setTimeout(() => setDots((dots + 1) % 4), 1000) }, [dots]);
    return <>{Array(dots).fill(true).map(v => '.').join('')}</>
}

function getRequestType(data: any, type: number): any[] {
    if (type === 1) return data['send']
    if (type === 2) return data['search']
    return data['pending']
}

function usersListActions(type: any) {
    switch (type) {
        case 3: return <>
            <Button className="r-lay--action__accept">
                <div>Accept</div>
                <ThumbUpIcon />
            </Button>
            <Button className="r-lay--action__reject">
                <div>Reject</div>
                <ThumbDownIcon />
            </Button>
        </>
        case 1: return <Button className="r-lay--action__reject">
            <div>Revoke</div>
            <CancelIcon />
        </Button>

        case 2: return <>
            <div className="r-lay-search">
                <Button className="r-lay--action__send">
                    <div id='search-req'>Send Request</div>
                    <SendIcon />
                </Button>
            </div>
        </>
    }
}