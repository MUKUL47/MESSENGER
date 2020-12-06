import React, { useContext, useEffect, useReducer, useState } from 'react';
import ToastMessage from '../../../../shared/components/toast/toast';
import Api from '../../../../shared/server';
import Utils, { setGlobalToggleFunc, toastMessage } from '../../../../shared/utils';
import RequestRenderer from './requestrenderer';
export default function Requests() {
    const data = {
        sent: [],
        search: [],
        pending: [],
        page: 0,
        isLoading: false
    }
    const [requestData, setRequestData] = useReducer(setGlobalToggleFunc, data);
    const searchUsers = async (user: any) => {
        try {
            const response: any = await Api.getUsers(user, requestData.page, 10);
            setRequestData({ search: response.data.users })
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            //toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const sentRequests = async () => {
        try {
            const response: any = await Api.getMyNetwork('P@', requestData.page, 10);
            setRequestData({ search: [...requestData.sent, ...response.data.users] })
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            //toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const pendingRequests = async () => {
        try {
            const response: any = await Api.getMyNetwork('P', requestData.page, 10);
            setRequestData({ search: [...requestData.pending, ...response.data.users] })
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            //toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const onNavChange = (nav: number, user?: string) => {
        setRequestData({ isLoading: true })
        if (nav === 1) {
            sentRequests();
        } else if (nav === 2 && user) {
            searchUsers(user);
        } else if (nav === 3) {
            pendingRequests();
        }
    }
    useEffect(() => {
        setRequestData({ isLoading: true })
        // sentRequests();
    }, [])
    return (<RequestRenderer
        requestData={requestData}
        isLoading={requestData.isLoading}
        changeNav={onNavChange}
    />)
}