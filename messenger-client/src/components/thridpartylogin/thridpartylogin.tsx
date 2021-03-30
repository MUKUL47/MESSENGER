import React, { useEffect, useState } from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from '../../utils/server';
import { IResponse } from '../../interfaces/data-models';
import BermudaTriangle from '../../shared/localstorage.service';
import actions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import Api from '../../shared/server';
// import Routes from '../../shared/routes';
export default function ThirdPartyLogin() {
    const dispatch  = useDispatch()
    const history  = useHistory()
    useEffect(() => {
        try {
            const url = window.location.href.split('#')[1].split('&')
            const code = url.filter(a => a.split('=')[0] === 'access_token')[0].split('=')[1]
            storeIdentity(code)
        } catch (e) {
            history.push({ pathname: '/login'})
        }
    },[])
    const setStorage = (token : string, refreshToken : string) : void => {
        BermudaTriangle.setTriangle('token', token)
        BermudaTriangle.setTriangle('refreshToken',refreshToken)
    }
    const storeIdentity = async (accessToken: any) => {
        try{
            const response : IResponse = await API.authorize('google', accessToken)
            const message = response?.data?.message;
            if(message.token){
                setStorage(message.token, message.refresh_token)
                if(message.statusCode === 201){
                    const dispatchData = { identity: message.identity, name: '', image: null, id : message.id }
                    dispatch({ type : actions.STORE_USER, data : dispatchData })
                    history.push({ pathname: '/profile', state: { header: 'Complete your profile', identity: message.identity } })
                    return
                }
                const profileResponse : IResponse = await API.getProfile()
                const { id, displayName } = profileResponse?.data?.message;
                dispatch({ type : actions.STORE_USER, data : { identity: message.identity, name: displayName || '', image: null, id : id } })
                history.push({ pathname: '/home'})
            }else{
                history.push({ pathname: '/login'})
            }
        }
        catch(e){
            history.push({ pathname: '/login'})
        }
    }
    return (
            <Backdrop open={true}><CircularProgress color="inherit" /></Backdrop>
    )
}