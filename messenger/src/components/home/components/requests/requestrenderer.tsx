import React, { useContext, useEffect, useState } from 'react';
import profileImg from '../../../../assets/namaste.png'
import { Button, ThumbUpIcon, ThumbDownIcon, SendIcon, CancelIcon, QueryBuilderIcon, SearchIcon, TextField } from '../../../../shared/material-modules';
import './requests.scss'
export default function RequestRenderer() {
    const [nav, setNav] = useState(1);
    return (
        <>
            <div className="request-layout" >
                <div className="request-layout-nav">
                    <div id={nav === 1 ? 'nav__active' : ""} onClick={() => setNav(1)}>
                        Sent Requests
                        <SendIcon />
                    </div>
                    <div id={nav === 2 ? 'nav__active' : ""} onClick={() => setNav(2)}>
                        Search
                        <SearchIcon />
                    </div>
                    <div id={nav === 3 ? 'nav__active' : ""} onClick={() => setNav(3)}>
                        Pending Requests
                        <QueryBuilderIcon />
                    </div>
                </div>
                <div className="requests-lay">
                    {nav === 2 ?
                        <div className="search-bar">
                            <SearchIcon />
                            <TextField placeholder="Search Users" />
                        </div>
                        : null}
                    {
                        Array(10).fill(1).map(v => {
                            return <div className="r-lay-request">
                                <div className="r-lay--profile">
                                    <img src={profileImg} />
                                    <div>John Doe</div>
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

function usersListActions(type: any) {
    switch (type) {
        case 1: return <>
            <Button className="r-lay--action__accept">
                <div>Accept</div>
                <ThumbUpIcon />
            </Button>
            <Button className="r-lay--action__reject">
                <div>Reject</div>
                <ThumbDownIcon />
            </Button>
        </>
        case 3: return <Button className="r-lay--action__reject">
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