import React, { useEffect, useReducer } from 'react';
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
export default function Main() {
    Api.initApiInterceptor();
    const his = useHistory();
    const [globalToggle, setGlobalToggle] = useReducer(setGlobalToggleFunc, { toast: { type: '', message: '' }, isLoading: false });
    useEffect(() => {
        const toastUnsub = toastMessage.subscribe((data: any) => {
            if (data.logout) {
                localStorage.clear();
                window.location.href = Routes.default;
            }
            setGlobalToggle({ toast: { type: data.type, message: data.message } });
            setTimeout(() => setGlobalToggle({ toast: { type: '', message: false } }), (data.duration | 2500))
        })
        const toggleUnsub = toggleLoader.subscribe((bool: boolean) => { setGlobalToggle({ isLoading: bool }) });
        return () => {
            toastUnsub.unsubscribe();
            toggleUnsub.unsubscribe();
        }
    }, [])
    const defaultRedirect = () => <Redirect to={Routes.login} />;
    const globalDefaultComponents = (
        <>
            <BackdropLoader open={globalToggle.isLoading} />
            { globalToggle.toast && globalToggle.toast.message ? <ToastMessage message={globalToggle.toast.message} type={globalToggle.toast.type} /> : null}
        </>)
    const routes =
        <>
            {globalDefaultComponents}
            <UserContextData>
                <BrowserRouter>
                    <Switch>
                        <Route path={Routes.login} component={Login}></Route>
                        <Route path={Routes.home} component={Home}></Route>
                        <Route path={Routes.profile} component={Profile}></Route>
                        <Route path={Routes.notFound} component={defaultRedirect}></Route>
                        <Route path={Routes.default} component={defaultRedirect}></Route>
                    </Switch>
                </BrowserRouter>
            </UserContextData>
        </>
    return (routes);
}