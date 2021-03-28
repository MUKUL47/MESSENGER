import React from 'react'
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router';
import Login from '../../../components/login/login';
import { IUserStore } from '../../../interfaces/redux';
import Routes from '../../../utils/routes';
import BermudaTriangle from '../../localstorage.service';
import Initalizer from './initalizer';

export default function ProtectedRoute(props: any) {
    const userStore : IUserStore = useSelector((state : any) => state.userService)
    const Component = props.component;
    const redirectComponent = props?.location?.state?.skipAuth && userStore.id ? <Component />: BermudaTriangle.isFree() ? <Redirect to={Routes.login}/> : userStore.id ? <Component /> : <Initalizer path={ props.location.pathname}/>
    return (
        redirectComponent
    );
}