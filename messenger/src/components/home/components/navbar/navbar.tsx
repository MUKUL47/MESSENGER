import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Routes from '../../../../shared/routes';
import { UserContext } from '../../../contexts/userContext';
import NavRenderer from './ui/navbarRenderer';
export default function Navbar(props: any) {
    const userContext = useContext(UserContext);
    const pushHistory = useHistory();
    const logout = () => {
        localStorage.clear();
        pushHistory.push(Routes.login)
    }
    return (<NavRenderer onLogout={logout} />)
}