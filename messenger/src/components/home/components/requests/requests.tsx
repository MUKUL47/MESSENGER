import React, { useEffect, useReducer } from 'react';
import Api from '../../../../shared/server';
import Utils, { setGlobalToggleFunc, toastMessage } from '../../../../shared/utils';
import RequestRenderer from './requestrenderer';
export default function Requests() {
    const data = {
        sent: [],
        search: [],
        pending: [],
        page: 0,
        isLoading: false,
        requestInQueue: {}
    }
    const [requestData, setRequestData] = useReducer(setGlobalToggleFunc, data);
    const searchUsers = async (user: any) => {
        try {
            const response: any = await Api.getUsers(user, requestData.page, 10);
            const totalUsers = response?.data?.users ? response.data.users : [];
            if (totalUsers.length > 0) {
                // const cL: any[] = totalUsers.map((u: any) => Api.getSocialStatus(u.id));
                let usersResp: any = await Api.getSocialStatuses(totalUsers.map((u: any) => u.id));//await combineLatest(cL).toPromise();
                usersResp = usersResp?.data ? usersResp.data : [];
                console.log(usersResp)
                const withUserResp = totalUsers.map((user: any) => {
                    return { ...user, responseType: usersResp.find((u: any) => u.toId === user.id || u.fromId === user.id) }
                })
                console.log(withUserResp)
                setRequestData({ search: withUserResp, isLoading: false })
                return;
            }
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const sentRequests = async () => {
        try {
            const response: any = await Api.getMyNetwork('P@', requestData.page, 10);
            setRequestData({ sent: [...response.data.users] })
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const pendingRequests = async () => {
        try {
            const response: any = await Api.getMyNetwork('P', requestData.page, 10);
            setRequestData({ pending: [...response.data.users] })
            setRequestData({ isLoading: false })
        } catch (e) {
            setRequestData({ isLoading: false })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const onNavChange = (nav: number, user?: string) => {
        setRequestData({ isLoading: true })
        if (nav === 1) {
            setRequestData({ sent: [] })
            sentRequests();
        } else if (nav === 2) {
            if (!user) {
                setRequestData({ isLoading: false })
                return;
            }
            setRequestData({ search: [] })
            searchUsers(user);
        } else {
            setRequestData({ pending: [] })
            pendingRequests();
        }
    }
    const onResponse = async (id: string, answer: string, name: string) => {//0 no 1 yes
        setRequestData({ requestInQueue: { op: 'add', id: id + "_" + answer } })
        try {
            const pendingReq: any = [...requestData.pending];
            const pendIdx: number = pendingReq.findIndex((user: any) => user.userId === id);
            await Api.respondRequest(id, answer);
            delete pendingReq[pendIdx];
            setRequestData({ requestInQueue: { op: 'remove', id: id + "_" + answer }, pending: pendingReq })
            toastMessage.next({ type: true, message: `Request ${answer ? 'approved' : 'rejected'} for <b>${name}</b>`, duration: 3000 });
        } catch (e) {
            setRequestData({ requestInQueue: { op: 'remove', id: id } })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const onSendRevoke = async (id: string, name: string) => {
        setRequestData({ requestInQueue: { op: 'add', id: id } })
        try {
            const sentResults: any = [...requestData.sent];
            const sentIdx: number = sentResults.findIndex((user: any) => user.userId === id);
            await Api.revokeRequest(id);
            delete sentResults[sentIdx];
            setRequestData({ requestInQueue: { op: 'remove', id: id }, sent: sentResults })
            toastMessage.next({ type: true, message: `Request revoked for <b>${name}</b>`, duration: 3000 });
        } catch (e) {
            setRequestData({ requestInQueue: { op: 'remove', id: id } })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    const onSearch = async (id: string, name: string, type: string) => {
        setRequestData({ requestInQueue: { op: 'add', id: id } })
        try {
            const searchResults: any = [...requestData.search];
            const searchIdx: number = searchResults.findIndex((user: any) => user.id === id);
            if (type === 'add') {
                await Api.sendRequest(id);
                searchResults[searchIdx] = { ...searchResults[searchIdx], responseType: { response: 'P@' } }
            } else {
                await Api.revokeRequest(id);
                delete searchResults[searchIdx]['responseType'];
            }
            setRequestData({ requestInQueue: { op: 'remove', id: id }, search: searchResults })
            toastMessage.next({ type: true, message: type === 'add' ? `Request sent to <b>${name}</b>` : `Request revoked for <b>${name}</b>`, duration: 3000 });
        } catch (e) {
            setRequestData({ requestInQueue: { op: 'remove', id: id } })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 3000 });
        }
    }
    useEffect(() => {
        setRequestData({ isLoading: true })
        sentRequests();
    }, [])
    return (<RequestRenderer
        requestData={requestData}
        isLoading={requestData.isLoading}
        changeNav={onNavChange}
        searchAns={onSearch}
        revokeSentReq={onSendRevoke}
        respondApproval={onResponse}
    />)
}