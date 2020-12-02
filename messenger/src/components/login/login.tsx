import React, { useEffect, useReducer, useContext } from 'react';
import BackdropLoader from '../../shared/components/backdrop/backdrop';
import Otp from '../../shared/components/otp/otp';
import Api from '../../shared/server';
import Utils, { toggleLoader, toastMessage, setGlobalToggleFunc } from '../../shared/utils';
import LoginUi from './renderer';
import { useHistory } from "react-router-dom";
import Routes from '../../shared/routes';
import { UserContext } from '../contexts/userContext';
export default function Login() {
    const userContext: any = useContext(UserContext);
    const history = useHistory();
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc,
        { redirect: true, otpReady: false, emailMobile: '', otp: '', isLoading: false })
    useEffect(() => {
        document.title = 'Messenger';
        if (localStorage.length === 0) {
            document.title = 'Messenger - Login';
            setToggle({ redirect: false })
        } else {
            //redirect
            history.push(Routes.home)
        }
    }, []);
    const onEmailMobile = async (data: String) => {
        try {
            setToggle({ isLoading: true, otpReady: false })
            await Api.generateOtp(data, false);
            setToggle({ emailMobile: data, otpReady: true, isLoading: false })
            toastMessage.next({ type: true, message: `OTP sent to <strong>${data}</strong>`, duration: 3000 })
        } catch (e) {
            setToggle({ isLoading: false })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 2000 })
        }
    }

    const submitOtp = async (otp: string) => {
        try {
            toggleLoader.next(true);
            const response: any = await Api.verifyOtp(otp, toggle.emailMobile);
            setToggle({ otp: otp, otpReady: false });
            toggleLoader.next(false);
            localStorage.setItem('id', toggle.emailMobile);
            localStorage.setItem('secret', response.data.message);
            if (response.status === 201) {
                userContext.set({
                    user: toggle.emailMobile,
                    name: '',
                    blob: null
                });
                history.push({ pathname: '/profile', state: { header: 'Complete your profile', identity: toggle.emailMobile } })
                return
            }
            userContext.set({ user: toggle.emailMobile });
            history.push({ pathname: '/home' })
        } catch (e) {
            toggleLoader.next(false);
            const currErr = Utils.parseError(e);
            toastMessage.next({ type: false, message: Utils.globalDefaultError !== currErr ? currErr : 'Invalid OTP', duration: 2000 })
        }
    }
    const otp = toggle.otpReady ?
        <Otp verifyOtp={submitOtp} resend={() => onEmailMobile(toggle.emailMobile)} cancelOtp={() => setToggle({ otpReady: false })} /> : null;
    const jsx =
        !toggle.redirect ?
            <>
                <LoginUi onEmailMobile={onEmailMobile} {...toggle} />
                {otp}
            </> :
            <BackdropLoader open={toggle.redirect} />
    return (jsx)
}