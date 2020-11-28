import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory
  } from "react-router-dom";
import { LoginTemplate } from './loginTemplate';
import { timeout, cbToPromise, validator } from '../../shared/components/utils/short'
import { Api } from '../../shared/components/calls/server'
import {SimplePopover} from '../../shared/components/siders'
import { Input, Link, Button, Notification } from './templateClass'
export class Login extends React.Component{
    
    login = new Input( _ => this.inputOnChange('login', _), 'Enter Email or Mobile', 'text',  '')

    linkProps = new Link( _ => this.onLinkClick(_), 'First Time ?')

    buttonProps = new Button( _ => this.buttonOnClick('login'), 'Login', {cursor : "not-allowed"}, true)

    notificationProps =  new Notification(false, '', '')

    registerIdentity;

    constructor(props){
        super(props)
        this.state = {
            login : this.login.getAll(),
            link : this.linkProps.getAll(),
            button : this.buttonProps.getAll(),
            loader : false,
            notification : this.notificationProps.getAll()
        }
    }

    componentWillMount(){
    }

    inputOnChange(type, value){
        this.login.set(['value'], [value.target.value])
        if(validator(value.target.value, type)){
            this.buttonProps.set(['dynamicStyles', 'status'], [{cursor : "pointer"}, false])
        }else{
            this.buttonProps.set(['dynamicStyles', 'status'], [{cursor : "not-allowed"}, true])
        }
        this.setState({ login : this.login.getAll(), button : this.buttonProps.getAll()  })
    }

    onLinkClick(type){
        console.log('onLinkClick', type)
        const isRegister = type == 'First Time ?' || type == 'Go Back';
        const onClick =  _ => this.buttonOnClick( isRegister ? 'register' : 'login')
        this.buttonProps.set(['name', 'onClick','status'], [isRegister ? "Register" : "Login", onClick, true])
        this.linkProps.set(['value'],[isRegister ? 'Login Now' : 'First Time ?']);
        this.login.set(['type', 'placeholder', 'value'],[isRegister ? 'text' : 'number', isRegister ? 'Enter Email or Mobile' : 'Enter OTP', ''])
        this.setState({ link : this.linkProps.getAll(), button : this.buttonProps.getAll(), login : this.login.getAll() })
    }

    async buttonOnClick(type){
        try{
            if(type.trim() == 'register'){
                await this.setState({loader : true})
                const identity = this.login.get('value');
                this.registerIdentity = identity;
                const response = await Api.generateOtp(this.login.get('value').toLowerCase());
                this.login.set(['value', 'placeholder', 'type'], ['', 'Enter OTP for identity '+this.registerIdentity, 'number']);
                this.linkProps.set(['value'],['Go Back']);
                const onClick =  _ => this.buttonOnClick('otp');
                this.buttonProps.set(['name', 'status', 'onClick'], [ "Verify", true, onClick])
                this.setState
                ({  link : this.linkProps.getAll(), 
                    button : this.buttonProps.getAll(), 
                    login : this.login.getAll(), 
                    loader : false 
                });
                this.notificationProps.set(['status', 'message', 'type'],[true, `OTP has been sent to "${identity}"`,' notification_success'])
                this.setState({notification : this.notificationProps.getAll()});
                this.notificationProps.setIndividual('status',false)
                await timeout(2000)
                this.setState({ notification : this.notificationProps.getAll() })
                return;           
            }
            else if(type == 'otp'){
                await this.setState({loader : true});
                const response  = await Api.verifyOtp(Number(this.login.get('value')), this.registerIdentity);
                this.setState({loader : false});
                this.setLocalstorage(this.registerIdentity, response.message)
                this.props.history.push('/home')
                return;
            }
        }catch(err){
            const msg = err.message
            this.notificationProps.set(['status', 'message', 'type'],[true, `Error : ${msg}`,' notification_error'])
            this.setState({loader : false, notification : this.notificationProps.getAll()});
            this.notificationProps.setIndividual('status',false)
            await timeout(2000)
            this.setState({ notification : this.notificationProps.getAll() })
            if(err.redirect && err.redirect == 'register') this.onLinkClick('First Time ?')
        }     
    }

    setLocalstorage(identity, keygen){
        localStorage.clear();
        localStorage.setItem(identity, keygen)
    }

    render(){
        const div = 
        <div className = "bg-login">
            <LoginTemplate 
                login   = {this.state.login}
                link    = {this.state.link}
                button  = {this.state.button}
                loader  = {this.state.loader}
                notification = {this.state.notification}
            />
        </div>;
        return div;
    }
}