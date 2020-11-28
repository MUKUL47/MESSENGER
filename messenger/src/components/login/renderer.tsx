import React, { useState } from 'react';
import namasteImg from '../../assets/namaste.png'
import googleImg from '../../assets/google.png'
import './login.scss'
import { TextField, Button } from '../../shared/material-modules';
import Utils from '../../shared/utils';
export default function LoginUi(props: any) {
    const { onEmailMobile } = props;
    const [emailMobile, setEmailMobile] = useState<String>('');
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
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className="submit"
                                onClick={e => onEmailMobile(emailMobile)}
                                disabled={!Utils.validateEmailMobile(emailMobile.trim())}
                            >
                                Submit
                            </Button>
                            <div>
                                <Button
                                    variant="contained"
                                    className="continue-google"
                                    onClick={e => onEmailMobile({ thirdParty: 'google' })}
                                >
                                    Google
                                </Button>
                                <span className="google-img">
                                    <img src={googleImg} width="20px" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}