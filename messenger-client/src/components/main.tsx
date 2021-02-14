import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    useHistory,
} from "react-router-dom";
import Routes from '../utils/routes';
import Home from './home/home'
import Login from './login/login'
import './main.scss'
import Profile from './profile/profile';
import ThirdPartyLogin from './thridpartylogin/thridpartylogin';
import ToastMessage from '../shared/components/toast/toast';
import BackdropLoader from '../shared/components/backdrop/backdrop';
import { logoutService, toastMessage } from '../shared/utils';
import { useDispatch } from 'react-redux';
import actions, { MESSAGE_ACTIONS } from '../redux/actions';
import API from '../utils/server';
import BermudaTriangle from '../shared/localstorage.service';

export default function Main() {
    const defaultRedirect = () => <Redirect to={Routes.login} />;
    const [intercepted, setIntercept] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch({ type : actions.SHOW_LOADER })
        API.initApiInterceptor();
        toastMessage.subscribe((data) => {
            if (data.logout) {
                localStorage.clear();
                dispatch({ type : actions.STORE_USER, data : { name : null, image : null } })
                setTimeout(() => window.location.href = Routes.default, 2000)
            }
            dispatch({ type : actions.TOAST_MESSAGE, data : { message : data.message, type : data.type } })
        })
        logoutService.subscribe(() => {
            dispatch({ type : actions.RESET_USER })
            dispatch({ type : MESSAGE_ACTIONS.RESET_FRIENDS })
            BermudaTriangle.clearTriangle();
            window.location.href='/login'
        })
        setIntercept(true)
        dispatch({ type : actions.STOP_LOADER })
    },[])
    return (
        <>
            {
                intercepted ? 
                <>
                    <BackdropLoader/>
                    <ToastMessage/>
                    <BrowserRouter>
                        <Switch>
                            <Route path={Routes.login} component={Login}></Route>
                            <Route path={Routes.home} component={Home}></Route>
                            <Route path={Routes.profile} component={Profile}></Route>
                            <Route path={Routes.thridPartyLogin} component={ThirdPartyLogin}></Route>
                            <Route path={Routes.notFound} component={defaultRedirect}></Route>
                            <Route path={Routes.default} component={defaultRedirect}></Route>
                        </Switch>
                    </BrowserRouter>
                </>:null
            }
        </>
    )
}
