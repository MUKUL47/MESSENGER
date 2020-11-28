import React from 'react'
import './style.css'
import { CustomInput, CustomButton, CustomLoader } from '../../shared/components/inputTemplates'
import messengerIcon from '../../assets/images/messenger.png'
import { SimplePopover } from '../../shared/components/siders';
export class LoginTemplate extends React.Component{
    login;
    password;
    constructor(props){
        super(props)
        console.log(props)
    }

    componentWillMount(){
    }

    componentDidUpdate(){
        console.log('update')
    }

    render(){
        const login = 
        <div className = "parent">
            <div>
                <img src = {messengerIcon} className='logo'/>
            </div>

            <div className = "login">
                <CustomInput {...this.props.login} /> 
            </div>  

            <div className = "btn">
                <CustomButton {...this.props.button}  /> 
            </div>    

            <h3 onClick = { _ => this.props.link.onClick(this.props.link.value) } 
                className="register">
                {this.props.link.value}
            </h3>  
        { this.props.loader ? <CustomLoader/> : '' }

            <SimplePopover {...this.props.notification}></SimplePopover>

        </div>

        return (login);
    }
}
