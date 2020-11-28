import React, { useState, useEffect } from 'react';
import './userProfile.scss'
import { 
    Dialog, defaultProfile, CircularProgress
} 
    from '../../../../../../../shared/components/material-ui-modules'
let globalProps;
export const UserProfile = props => {
    globalProps = props;
    console.log(globalProps)
    return  (
        <Dialog 
            onClose = {e => globalProps.close()}
            aria-labelledby="simple-dialog-title" 
            open = {true}>
            {Template()}
        </Dialog>)
}

const Template = _ => {
    return (
        <div className='user-profile-parent'>
            <div className='close' onClick={e => globalProps.close()} >x</div>
            <div className='user-outer'>
                <div className='user-profile-image p-b-10'>
                    {/* <img src = {defaultProfile} id = 'profile-image' alt="mukul"/> */}
                    {globalProps.user.image ? 
                        <img src = {globalProps.user.image} id = 'profile-image' alt={globalProps.user.name}/>
                    :
                        <div className="default-pic">
                            <div className="s-name">
                                {globalProps.user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    }
                    
                </div>
                <div className="name p-b-10 standard-text">
                    {globalProps.user.name}
                </div>
                <div className="joined-on p-b-10">
                    Joined on {globalProps.user.createdAt}
                </div>
                <div>
                   {GetNetworkSection()}
                </div>
            </div>
        </div>
    )
}

const GetNetworkSection = _ => {
    const resp = globalProps.user.response;
    console.log('-respresp-',resp)
    const myId = localStorage.getItem('id')
    console.log(resp, myId)
    const [socialStatus, setSocialStatus] = useState(resp)
    const [inProgress, setInProgress] = useState(false)
    

    const afterRequest = async (type, answer) => {
        try{
            if(inProgress) return;
            setInProgress(true)
            await globalProps.requests(type, globalProps.user.id, answer, {...globalProps.user, userId : globalProps.user.id})
            if(type === 'add'){
                setSocialStatus({ response : 'P@'+myId })
            }else if(type === 'respond'){
                setSocialStatus(answer === 1 ? { response : 'A' } : null)
            }else{
                setSocialStatus(null)
            }
            setInProgress(false)
        }catch(ee){
            setInProgress(false)
        }
    }
    if(!socialStatus){
        return  <div className='btn-layout'> 
                    <span 
                        className='send' 
                        onClick={e => afterRequest('add')}>
                        Send Request
                    </span> 
                </div>
    }
    else if(socialStatus && socialStatus.response === `P@${myId}`){
        return  <div className='btn-layout'> 
                    <span 
                        className='send revoke'
                        onClick={e => afterRequest('revoke')}>
                        Revoke Request
                    </span> 
                </div>
    }
    else if(socialStatus && 
            socialStatus.response.charAt(0) === `P` && 
            socialStatus.response.substr(1) !== `@${myId}`){
                return  <div className='btn-layout'> 
                            <span 
                                className='send m-r-10'
                                onClick={e => afterRequest('respond', 1)}
                            >Approve</span> 
                            <span 
                                className='send revoke'
                                onClick={e => afterRequest('respond', 0)}
                            >Reject</span> 
                        </div>
    }else if(socialStatus &&
                socialStatus.response.charAt(0) === 'A'){
        return  <div className='btn-layout'> 
                    <span 
                        className='send revoke'
                        onClick={e => afterRequest('remove')}>
                        Remove
                    </span> 
                </div>
                }
}