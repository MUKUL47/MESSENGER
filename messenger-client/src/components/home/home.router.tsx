import React, { useContext } from 'react'
import {
    Switch,
    Route,
    BrowserRouter 
} from "react-router-dom";
import Routes from '../../utils/routes';
import { SocketContext } from './socket.context';
import Chat from './home-components/chat-section/chat';
import Navbar from './home-components/navbar/navbar';
import Request from './home-components/requests/request';
import './home.scss'
import { CircularProgress } from '@material-ui/core';
import emptyProfile from '../../assets/empty-profile.svg'
export default function HomRouter(props : any) {
    const {event, error} = useContext(SocketContext)
    const {
        profileReady,
        isLoading
    } = props;
    return (
        <>
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
               {event ?

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
                    </div> : <div className="loading-context"><CircularProgress /></div>}
                </Route>
            </Switch>
        </>
        
    )
}