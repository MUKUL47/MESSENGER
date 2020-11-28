import React from 'react'
import {RouteController} from './routing/routeController'
import { Api, globalMessages } from '../shared/components/calls/server'
import { SnackBar } from '../shared/components/utils/miscellaneousTemplates'
export class Main extends React.Component {
    constructor(props){
        super(props)
        Api.initApiInterceptor()
        this.state = { 
            vertical : 'bottom',
            horizontal: 'right',
            open : false,
            timer : 6000,
            message : '',
            inSubscribe : false
         }
    }
    componentWillMount(){
        globalMessages.subscribe({ next : msg => {
            const _this = this;
            if(!this.state.inSubscribe){
                this.setState({
                    ...this.state.snackBar,
                    message : msg.message,
                    open : true,
                    inSubscribe : true,
                })
                setTimeout(() => {
                    this.setState({
                        ...this.state.snackBar,
                        open : false,
                        inSubscribe : false
                    })
                },3000)
                if(msg.reset){
                    localStorage.clear()
                    window.location.reload()
                }
            }
        }})
    }
    render(){
        return (
        <div>
            <RouteController/>
            <SnackBar {...this.state}/>
        </div>
        )
    }
}