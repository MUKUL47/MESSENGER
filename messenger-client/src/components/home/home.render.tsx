import React from 'react'
import {
    Switch,
    Route,
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
            <Switch>
                <Route exact path={Routes.home} component=
                    {() =>
                        <div className="chatsection" >
                            <Chat />
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
            </Switch>
        </div>
    )
}
