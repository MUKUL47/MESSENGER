import React, { useEffect } from 'react';
import ChatSection from '../components/chatsection/chatsection';
import Navbar from '../components/navbar/navbar';
import './home.scss'
import {
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import BackdropLoader from '../../../shared/components/backdrop/backdrop';
import Routes from '../../../shared/routes';
export default function HomeRenderer() {
    return (
        <div className="home-layout">
            <div className="navbar">
                <Navbar />
            </div>
            <Switch>
                <Route exact path={Routes.friend} component={() =>
                    <div className="chatsection">
                        <ChatSection />
                    </div>
                }></Route>
                <Route component={() =>
                    <div className="chatsection">
                        <BackdropLoader open={true} />
                    </div>
                }></Route>
            </Switch>
        </div>
    )
}