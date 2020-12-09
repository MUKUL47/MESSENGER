import React, { useContext, useEffect, useReducer } from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect,
    useHistory,
} from "react-router-dom";
import Routes from '../shared/routes';
import Utils, { toastMessage, toggleLoader, setGlobalToggleFunc } from '../shared/utils';
import BackdropLoader from '../shared/components/backdrop/backdrop';
import ToastMessage from '../shared/components/toast/toast';
import Login from './login/login';
import Home from './home/home';
import Profile from './profile/profile';
import UserContextData from './contexts/userContext';
import Api from '../shared/server';
import { ThirdPartyLogin } from './thirdpartylogin/thridpartyredirection';
import { GlobalContext } from './contexts/globalComponentContext';
import GlobalContextData from './contexts/globalComponentContext';
import { UserContext } from './contexts/userContext';
export default function Main() {
    console.log(window.location)
    Api.initApiInterceptor();
    const defaultRedirect = () => <Redirect to={Routes.login} />;
    const routes =
        <>
            <UserContextData>
                <GlobalContextData>
                    <GlobalComponents />
                </GlobalContextData>
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
            </UserContextData>
        </>
    return (routes);
}

function GlobalComponents() {
    const globalContext: any = useContext(GlobalContext);
    const userContext: any = useContext(UserContext);
    useEffect(() => {
        console.log('first use effect')
        const toastUnsub = toastMessage.subscribe((data: any) => {
            if (data.logout) {
                localStorage.clear();
                userContext.set({ name: null, blob: null })
                window.location.href = Routes.default;
            }
            globalContext.set({ toast: { type: data.type, message: data.message, rand: Math.random() } });
        })
        const toggleUnsub = toggleLoader.subscribe((bool: boolean) => { globalContext.set({ isLoading: bool }) });
        return () => {
            toastUnsub.unsubscribe();
            toggleUnsub.unsubscribe();
        }
    }, [])
    return (<>
        <BackdropLoader open={globalContext.get.isLoading} />
        <ToastMessage {...globalContext.get.toast} />
    </>)
}