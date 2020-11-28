import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Login } from '../login/login'
import { MainWindow } from '../main-window/mainWindowRoutingController'
import { ClientRoutes } from '../../shared/components/utils/clientRoutes';
import { MainPage } from '../../components/registerLogin/mainPage'
import { Profile } from '../../components/registerLogin/profile/profile'
import { ThirdPartyLogin } from '../../components/registerLogin/thirdPartyLogin/thirdPartyLogin'

export class RootRoutes extends React.Component{
    render(){
        let route = 
        <Router>
            <Route exact path={ClientRoutes.default} component = { () => <Redirect to={ClientRoutes.user}  />}></Route>
            <Route exact path={ClientRoutes.login} component={MainPage}></Route>
            <Route exact path={ClientRoutes.user} component={MainWindow}></Route>
            <Route exact path={ClientRoutes.thirdPartyLogin} component={ThirdPartyLogin}></Route>
            <Route exact path={ClientRoutes.profile} component={Profile}></Route>
        </Router>
        return (route);
    }

}