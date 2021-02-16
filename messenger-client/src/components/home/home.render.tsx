import React, { useContext } from 'react'
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
import SocketContextData, { SocketContext } from './socket.context';
import HomRouter from './home.router';
export default function HomeRender(props : any) {
    //profileReady
    return (
        <div className="home-section">
            <SocketContextData>
                <HomRouter {...props}/>
            </SocketContextData>
        </div>
    )
}
