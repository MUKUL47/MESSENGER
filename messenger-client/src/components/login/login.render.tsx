import React, { useState } from 'react';
import namasteImg from '../../assets/namaste.png'
import googleImg from '../../assets/google.png'
import './login.scss'
import { TextField, Button, CircularProgress } from '../../shared/material-modules';
import Utils from '../../shared/utils';
export default function LoginRender(props: any) {
    const { isLoading, authenticate } = props;
    const [emailMobile, setEmailMobile] = useState<String>('');
    const [loginType, setLoginType] = useState<String>('Login')
    return (
        <>
            <div className="login">
                <div className="login-layout">
                    <div className="login-img margin-auto">
                        <img src={namasteImg} alt="namaste" width="150px" height="150px" />
                    </div>
                    <div className="login-form margin-auto">
                        <div className="mob-logo" style={{ display: 'none' }}>
                            <img src={namasteImg} alt="namaste" width="100px" height="100px" />
                        </div>
                        <div className="form">
                            <TextField
                                id="outlined-basic"
                                placeholder="Email or Mobile"
                                variant="outlined"
                                className="input-text"
                                onChange={e => setEmailMobile(e.target.value)}
                                onKeyDown={(e: any) => {
                                    if (e.code === "Enter") {
                                        authenticate(emailMobile, loginType)
                                    }
                                }}
                            />
                            <div className="login-toggle">
                                <input type="checkbox" value={(loginType === 'Login') as any} onClick={() => setLoginType(loginType === 'Login' ? 'Register' : 'Login')}/>
                                <p>{loginType === 'Login' ? 'Register' : 'Login'}</p>
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                className="submit"
                                onClick={e => authenticate(emailMobile, loginType)}
                                disabled={!Utils.validateEmailMobile(emailMobile.trim()) || isLoading}
                            >
                                {
                                    isLoading ?
                                        <CircularProgress className="submit__loader" />
                                        : loginType
                                }
                            </Button>
                            <div>
                                <Button
                                    variant="contained"
                                    className="continue-google"
                                    onClick={e => authenticate(emailMobile, 'google')}
                                    disabled={isLoading}
                                >
                                    Google
                                </Button>
                                <span className="google-img">
                                    <img src={googleImg} width="20px" alt="Google"/>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}