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
import emptyProfile from '../../assets/empty-profile.svg'
import { CircularProgress } from '@material-ui/core';
import SocketContextData from './socket.context';
export default function HomeRender(props : any) {
    const {
        profileReady,
        isLoading
    } = props;
    //profileReady
    return (
        <SocketContextData>
            <div className="home-section">
                <div className="navbar">
                    <Navbar />
                </div>
                    <Switch>
                        <Route path={Routes.requests}>
                            <div className="request-section">
                                <Request />
                            </div>
                        </Route>
                        <Route path={Routes.home}>
                            <div className="chatsection" >
                                {
                                    profileReady && !isLoading? 
                                    <Chat /> :
                                    <div className="empty-profile">
                                        {
                                            isLoading ?
                                            <CircularProgress /> : 
                                            <>
                                                <img src={emptyProfile} alt=""/>
                                                <p>Profile is Empty</p>
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                        </Route>
                    </Switch>
            </div>
        </SocketContextData>
    )
}
