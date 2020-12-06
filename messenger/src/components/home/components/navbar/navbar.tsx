import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Routes from '../../../../shared/routes';
import Api from '../../../../shared/server';
import Utils, { toastMessage } from '../../../../shared/utils';
import { UserContext } from '../../../contexts/userContext';
import NavRenderer from './ui/navbarRenderer';
export default function Navbar() {
    const userContext: any = useContext(UserContext);
    const pushHistory = useHistory();
    const logout = (): void => {
        localStorage.clear();
        pushHistory.push(Routes.login)
    }
    const updateProfile = (): void => {
        Api.getProfile('_').then((response: any) => {
            const profile = response?.data[0] ? response.data[0] : null;
            if (profile) {
                const blob = `${profile.image_blob}` == 'null' ? null : profile.image_blob;
                userContext.set({ user: profile.identity, name: profile.name, blob: blob })
            }
        })
    }
    useEffect(() => {
        if (!userContext.get.name) {
            updateProfile();
        }
    }, [])
    return (<NavRenderer onLogout={logout} />)
}