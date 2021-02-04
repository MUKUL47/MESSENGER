import React, { useEffect } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Routes from '../utils/routes';
import Home from './home/home'
import Login from './login/login'
import './main.scss'
import Profile from './profile/profile';
import { ThirdPartyLogin } from './thridpartylogin/thridpartylogin';
import ToastMessage from '../shared/components/toast/toast';
import BackdropLoader from '../shared/components/backdrop/backdrop';
import { toastMessage } from '../shared/utils';
import { useDispatch } from 'react-redux';
import actions from '../redux/actions';
import API from '../utils/server';
export default function Main() {
    const defaultRedirect = () => <Redirect to={Routes.login} />;
    const dispatch = useDispatch()
    useEffect(() => {
        API.initApiInterceptor();
        toastMessage.subscribe((data) => {
            if (data.logout) {
                localStorage.clear();
                dispatch({ type : actions.STORE_USER, data : { name : null, image : null } })
                window.location.href = Routes.default;
            }
            dispatch({ type : actions.TOAST_MESSAGE, data : { message : data.message, type : data.type } })
        })
    },[])
    return (
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
        </>
    )
}
