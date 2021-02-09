import React from 'react'
import {
    Switch,
    Route,
    BrowserRouter 
} from "react-router-dom";
import Routes from '../../utils/routes';
import Chat from './home-components/chat-section/chat';
import Navbar from './home-components/navbar/navbar';
import Request from './home-components/requests/request';
import './home.scss'
export default function HomeRender() {
    return (
        <div className="home-section">
            <div className="navbar">
                <Navbar />
            </div>
            <BrowserRouter>
                <Route exact path={Routes.home} component=
                    {() =>
                        <div className="chatsection" >
                            <Request />
                            {/* <Chat /> */}
                        </div>
                    }>
                </Route>
                <Route exact path={Routes.requests} component=
                    {() =>
                        <div className="request-section">
                            <Request />
                        </div>
                    }>
                </Route>
            </BrowserRouter>
        </div>
    )
}
