import React, { useEffect, useReducer } from 'react';
import BackdropLoader from '../../shared/components/backdrop/backdrop';
import Otp from '../../shared/components/otp/otp';
import Api from '../../shared/server';
import Utils, { toggleLoader, toastMessage } from '../../shared/utils';
import LoginUi from './renderer';
import { useHistory } from "react-router-dom";
import Routes from '../../shared/routes';
export default function Login() {
    const history = useHistory();
    const setToggleData = (toggle: any, data: any) => { return { ...toggle, ...data } }
    const [toggle, setToggle] = useReducer(setToggleData, { redirect: true, otpReady: false, emailMobile: '', otp: '' })
    useEffect(() => {
        if (localStorage.length === 0) {
            setToggle({ redirect: false })
        } else {
            //redirect
            history.push(Routes.home)
        }
    }, []);
    const onEmailMobile = async (data: String) => {
        try {
            toggleLoader.next(true);
            await Api.generateOtp(data, false);
            toggleLoader.next(false);
            setToggle({ emailMobile: data, otpReady: true })
            toastMessage.next({ type: true, message: `OTP sent to ${toggle.emailMobile}.`, duration: 3000 })
        } catch (e) {
            toggleLoader.next(false);
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 2000 })
        }
    }

    const submitOtp = async (otp: string) => {
            try {
                toggleLoader.next(true);
                await Api.verifyOtp(otp, toggle.emailMobile);
                toggleLoader.next(false);
                setToggle({ otp: otp, otpReady: false });
                // toastMessage.next({ type: true, message: `OTP sent to ${toggle.emailMobile}.`, duration: 3000 })
            } catch (e) {
                toggleLoader.next(false);
                toastMessage.next({ type: false, message: Utils.parseError(e), duration: 2000 })
            }
    }
    const otp = toggle.otpReady ?
        <Otp verifyOtp={submitOtp} resend={() => submitOtp(toggle.otp)} cancelOtp={() => setToggle({ otpReady: false })} /> : null;
    const jsx =
        !toggle.redirect ?
            <>
                <LoginUi onEmailMobile={onEmailMobile} />
                {otp}
            </> :
            <BackdropLoader open={toggle.redirect} />
    return (jsx)
}