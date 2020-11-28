import React, {useState, useEffect, createRef} from 'react'
import { Helmet } from 'react-helmet'
import './mainPage.scss'
import google from '../../assets/images/google.png'
import namasteImg from '../../assets/images/namaste.png'
import Button from '@material-ui/core/Button';
import { validator, parseError, globalDefaultError } from '../../shared/components/utils/short'
import { Api, globalMessages } from '../../shared/components/calls/server'
import { DoubleArrowIcon, 
    Dialog, 
    CloseIcon, 
    CheckCircleOutlineIcon, 
    ReplayIcon,
    TextField,
    CircularProgress } from '../../shared/components/material-ui-modules'
export const MainPage = props => {
    const [identity, setIdentity] = useState('')
    const [otpReady, setOtpReady] = useState(false)
    const [registerInProgress, setRegisterInProgess] = useState(null)
    const validIdentity = validator(identity, false)
    const submit = e => {
        if(!validIdentity || registerInProgress) return
        setRegisterInProgess(true)
        Api.generateOtp(identity).
        then(response => {
            setOtpReady(true)
            globalMessages.next({ message : 'OTP sent to '+identity })
        }).catch(err => {
            setRegisterInProgess(false)
            globalMessages.next({message : parseError(err)})
        })
    }

    const otp = <OtpBlock 
        identity = {identity} 
        cancelOtp = {e => {
            setOtpReady(false)
            setRegisterInProgess(false)
        }}
        {...props}
    />
    return(
    <div className="parentRegister">
        <Helmet>
          <title>Messenger - Login or Register</title>
        </Helmet>
        {otpReady ? otp : null}
        <div className="modalParentRegister">
            <div className="modal">

                <div className="logo-details">
                    <div className='logo-all'>
                        <div className="logo">
                            <img src={namasteImg} className='namasteIcon'/>
                        </div>
                    </div>
                </div>
               
                <div className="form-details">
                    <div className="logo">
                        <div className="logo-top">
                            <img src={namasteImg} className='namasteIcon'/>
                        </div>
                        <TextField 
                            id="outlined-basic" 
                            placeholder="Email or Mobile" 
                            variant="outlined" 
                            className="input-text"
                            value = {identity}
                            autoFocus
                            onKeyPress = {e => { if(e.key === 'Enter') submit(true) }}
                            onChange = {e => setIdentity(e.target.value)}
                        />
                        <Button 
                            variant="contained"
                            onClick = {e => submit(true)}
                            className= {
                                !validIdentity ?
                                'submit-btn submit-dis' 
                                :
                                (
                                    registerInProgress ? 
                                    'submit-btn submit-dis'
                                    : 
                                    'submit-btn submit-bg'
                                )
                                
                            }
                            disabled = {!validIdentity || registerInProgress}
                        >
                        Submit
                        {validIdentity && !registerInProgress? 
                        <DoubleArrowIcon className="valid-id-arrow double-arrow"/> : null
                        }
                        {registerInProgress ? <CircularProgress className="valid-id-arrow wait"/> : null}
                        </Button>
                        <Button 
                            variant="contained"
                            className="submit-btn"
                            id='google-btn'
                            onClick={e => { window.location.href = Api.googleOauth }}
                        >
                        <p>Continue with</p>
                        <img src={google} id='google-sign'/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

const OtpBlock = props => {
    const [focusOn, setFocusOn] = useState(0)
    const [values, setValues] = useState({0 : '', 1 : '', 2 : '', 3 : '', 4 : '', 5 : ''})
    const [focuses, setFocuses] = useState(Array(6).fill(true).map(_ => createRef()))
    const [otpValid, setOtpValid] = useState(null)
    const [inProgress, setInProgress] = useState(false)
    const onClic = e => {
        setFocusOn(e)
    }
    useEffect(() => {
        const otp = Object.values(values).map(v => v).join('')
        if(`${otp}`.length === 6){
            setOtpValid(otp)
            return;
        }
        setOtpValid(null)
    },[values])

    const resendOtp = e => {
        if(inProgress) return
        setInProgress(true)
        Api.generateOtp(props.identity).
        then(response => {
            setInProgress(null)
            globalMessages.next({ message : 'OTP sent to '+props.identity })
        }).catch(err => {
            setInProgress(null)
            globalMessages.next({message : parseError(err)})
        })
    }

    const onKeyU = (e, i) => {
        if(e.key <= 9 || e.key >= 0){
            if(i < 5) {
                setFocusOn(i+1)
                focuses[i+1].current.focus()
            }
        }
    }
    const verifyOtp = e => {
        if(!otpValid || inProgress){ return }
        console.log('verifyOtp')
        setInProgress(true)
        Api.verifyOtp(otpValid, props.identity). 
        then(response => {
            setInProgress(null)
            localStorage.setItem(props.identity, response.data.message)
            if(response.status === 201){
                props.history.push({pathname : '/profile', state: { header: 'Complete your profile', identity : props.identity }})
                return
            }
            props.history.push({pathname : '/home'})
        }).catch(e => {   
            setInProgress(null)
            const currErr = parseError(e);
            globalMessages.next({ message : globalDefaultError !== currErr ? currErr : 'Invalid OTP' })
        })
    }
    const onKeyP = (e, i) => {
        if(e.keyCode === 13) {
            verifyOtp()
            return;
        }
        if(e.keyCode === 8 && (focusOn) > 0){
            const cV = {...values}
            cV[i] = ''
            setValues(cV)
            if(values[i] === ''){
                setFocusOn(focusOn-1)
                focuses[focusOn-1].current.focus()
            }
        }
    }
    
    const onChang = (e, i) => {
        const val = `${e.target.value}`;
        if(!isNaN(Number(val))){
            const cV = {...values}
            cV[i] = val.length === 1 ? val : val.charAt(val.length-1)
            setValues(cV)
        }
    }
    const isEnabled = otpValid && !inProgress
    return  (
        <div className='otp-parent'>
        <Dialog 
            open = {true}>
                <div className='otp-modal'>
                    <div className='goBack'>
                        {
                            !inProgress ? 
                            <CloseIcon className="close-otp" onClick={e => { if(!inProgress){ props.cancelOtp() } }}/> : 
                            null    
                        }
                        
                    </div>
                    <div className="otp-title"> 
                        Enter OTP send to <b>{props.identity}</b>
                    </div>
                    <div className="otp-input">
                        {Array(6).fill(true).map( (v, i) => {
                            return <input 
                                    className='otp-inp' 
                                    key         =   {i} 
                                    ref         =   {focuses[i]}
                                    id          =   {`otp-inp-${i}`} 
                                    autoFocus   =   {i == focusOn}
                                    onClick     =   {e => onClic(i)}
                                    onKeyPress  =   {e => onKeyU(e, i)}
                                    value       =   {values[i]}
                                    onKeyDown   =   {e => onKeyP(e, i)}
                                    onChange    =   {e => onChang(e,i)}
                                    onFocus     =   {e => e.target.select()}
                                    autoFocus   =   {i === 0}
                            />
                        })}
                        </div>
                    <div className="otp-btns">
                        <span className='otp-verify'>
                            <Button 
                                variant="contained" 
                                className={isEnabled ? 'otp-verify-btn' : 'otp-verify-btn bg-empty-dis'}
                                onClick ={verifyOtp}
                                disabled = {!isEnabled}
                            >
                                Verify
                                <CheckCircleOutlineIcon className="icon"/>
                            </Button>
                        </span>
                        <span className='otp-resend'>
                            <Button 
                                variant="contained" 
                                className={!inProgress  ? 'otp-resend-btn' : 'otp-resend-btn bg-empty-dis'}
                                disabled = {inProgress}
                                onClick={resendOtp}
                            >
                                Resend
                                <ReplayIcon className="icon"/>
                            </Button>
                        </span>
                    </div>
                </div>
        </Dialog>
    </div>)
}