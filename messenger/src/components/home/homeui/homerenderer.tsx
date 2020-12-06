import React, { useContext, useEffect } from 'react';
import ChatSection from '../components/chatsection/chatsection';
import Navbar from '../components/navbar/navbar';
import './home.scss'
import {
    Switch,
    Route,
} from "react-router-dom";
import Routes from '../../../shared/routes';
import Requests from '../components/requests/requests';
import SocketContextData from '../../contexts/socketContext';
import ChatContextData from '../../contexts/chatContext';
export default function HomeRenderer(props: any) {
    return (
        <div className="home-layout">
            <div className="navbar">
                <Navbar />
            </div>
            <SocketContextData>
                <ChatContextData>
                    <Switch>
                        <Route exact path={Routes.home} component={() =>
                            <div className="chatsection" >
                                <ChatSection />
                            </div>
                        }></Route>
                        <Route exact path={Routes.requests} component={() =>
                            <div className="request-section">
                                <Requests />
                            </div>
                        }></Route>
                    </Switch>
                </ChatContextData>
            </SocketContextData>
        </div>
    )
}