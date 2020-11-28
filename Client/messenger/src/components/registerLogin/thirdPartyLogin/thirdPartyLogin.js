import React from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Api } from '../../../shared/components/calls/server'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
  } from "react-router-dom";
export class ThirdPartyLogin extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){
        const url = window.location.href.split('#')[1].split('&')
        const accessToken = url.filter(a => a.split('=')[0] == 'access_token')[0].split('=')[1]
        this.storeIdentity(accessToken)
    }

    async storeIdentity(accessToken){
        try{
            const response = await Api.thirdPartyAuthorization('google',accessToken)
            localStorage.setItem(response.data.identity, response.data.message)
            if(response.status === 201){
                this.props.history.push({pathname : '/profile', state: { header: 'Complete your profile', identity : response.data.identity }})
                return;
            }
            this.props.history.push({pathname : '/home'})
        }catch(e){
            this.props.history.push({pathname : '/login'})
        }
    }

    render(){
        return (<Backdrop open={true}><CircularProgress color="inherit" /></Backdrop>)
    }
}