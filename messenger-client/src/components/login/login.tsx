import React, { useEffect, useReducer } from 'react'
import LoginRender from './login.render'
import { useHistory } from "react-router-dom";
import Routes from '../../utils/routes';
import { setGlobalToggleFunc } from '../../shared/utils';
import { useDispatch } from 'react-redux';
import { IToastStore } from '../../interfaces/redux';
import actions from '../../redux/actions';
import serverRoutes from '../../utils/server-routes';
import API from '../../utils/server';
import IApiResponse from '../../interfaces/data-models';
import Otp from '../../shared/components/otp/otp';
import { AxiosRequestConfig } from 'axios';
import BermudaTriangle from '../../shared/localstorage.service';
export default function Login() {
    const history = useHistory()
    const dispatch  = useDispatch() 
    const loginContextData = { redirect : true, identity : '', otpReady : false, otp : '', isLoading : false, type : '' }
    const [loginContext, setLoginContext] = useReducer(setGlobalToggleFunc, loginContextData)
    const authenticate = async (identity : string, type : 'Login' | 'google' | 'Register') => {
        try{
            if(type === 'google'){
                window.location.href = serverRoutes.GOOGLE;
                return;
            }
            setLoginContext({ isLoading : true, type : type, identity : identity})
            const response : IApiResponse = await (type === 'Login' ? API.login : API.register)(identity, false)
            dispatch({ type : actions.TOAST_MESSAGE, data : { type : true, message : `OTP sent to ${identity}` } })
            setLoginContext({ isLoading : false, otpReady : true })
            console.log(response)
        }catch(e){
            setLoginContext({ isLoading : false })
            dispatch({ type : actions.TOAST_MESSAGE, data : { type : false, message : e } })
        }
    }
    const setStorage = (token : string, refreshToken : string) : void => {
        BermudaTriangle.setTriangle('token', token)
        BermudaTriangle.setTriangle('refreshToken',refreshToken)
    }
    const submitOtp = async (otp : string) => {
        try{
            setLoginContext({ isLoading : true, otpReady : false })
            const response : AxiosRequestConfig = await (loginContext.type === 'Login' ? API.login : API.register)(loginContext.identity, true, otp)
            const data = response.data.message;
            setStorage(data.token, data.refresh_token)
            if(response.data.statusCode === 201){
                const dispatchData = { identity: loginContext.identity, name: '', image: null, id : data.id }
                dispatch({ type : actions.STORE_USER, data : dispatchData })
                setLoginContext({ isLoading : false })
                history.push({ pathname: '/profile', state: { header: 'Complete your profile', identity: loginContext.identity } })
                return
            }
            const profileResponse : AxiosRequestConfig = await API.getProfile()
            const { userId, displayName } = profileResponse.data.message;
            dispatch({ type : actions.STORE_USER, data : { identity: loginContext.identity, name: displayName, image: null, id : userId } })
            history.push({ pathname: '/home'})
        }catch(e){
            setLoginContext({ isLoading : false, otpReady : true })
            dispatch({ type : actions.TOAST_MESSAGE, data : { type : false, message : e } })
        }
    }
    useEffect(() => {
        document.title = 'Messenger';
        if (BermudaTriangle.isFree()) {
            document.title = 'Messenger - Login';
            setLoginContext({ redirect: false })
        } else {
            history.push(Routes.home)
        }
    }, []);
    const otp = loginContext.otpReady ?
    <Otp 
        verifyOtp={submitOtp} 
        resend={() => authenticate(loginContext.identity, loginContext.type)} 
        cancelOtp={() => setLoginContext({ otpReady: false })} 
    /> : null;

    return (
        loginContext.redirect ? null :
        <>
            <LoginRender {...loginContext} authenticate={authenticate}/>
            {otp}
        </>
    )
}
