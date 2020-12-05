import React, { useEffect } from 'react';
import ChatSection from '../components/chatsection/chatsection';
import Navbar from '../components/navbar/navbar';
import './home.scss'
import {
    Switch,
    Route,
    useHistory,
    BrowserRouter,
} from "react-router-dom";
import BackdropLoader from '../../../shared/components/backdrop/backdrop';
import Routes from '../../../shared/routes';
import Requests from '../components/requests/requests';
import Search from '../components/search/search'
export default function HomeRenderer(props: any) {
    const { navBar } = props;
    console.log('->', props)
    return (
        <div className="home-layout">
            <div className="navbar">
                <Navbar />
            </div>
            <Switch>
                <Route exact path={Routes.home} component={() =>
                    <div className="chatsection">
                        <ChatSection />
                    </div>
                }></Route>
                <Route exact path={Routes.requests} component={() =>
                    <div className="request-section">
                        <Requests />
                    </div>
                }></Route>
                <Route exact path={Routes.search} component={() =>
                    <div className="search-section">
                        <Search />
                    </div>
                }></Route>
            </Switch>
        </div>
    )
}