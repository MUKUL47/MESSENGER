import React from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Api from '../../shared/server';
import Routes from '../../shared/routes';
export class ThirdPartyLogin extends React.Component {
    constructor(props: any) {
        super(props)
    }
    componentDidMount() {
        debugger
        const url = window.location.href.split('#')[1].split('&')
        const accessToken = url.filter(a => a.split('=')[0] == 'access_token')[0].split('=')[1]
        this.storeIdentity(accessToken)
    }

    async storeIdentity(accessToken: any) {
        try {
            const response = await Api.thirdPartyAuthorization('google', accessToken)
            localStorage.setItem(response.data.identity, response.data.message)
            if (response.status === 201) {
                (this.props as any).history.push({ pathname: Routes.profile, state: { header: 'Complete your profile', identity: response.data.identity } })
                return;
            }
            (this.props as any).history.push({ pathname: Routes.home })
        } catch (e) {
            (this.props as any).history.push({ pathname: Routes.login })
        }
    }

    render() {
        return (<Backdrop open={true}><CircularProgress color="inherit" /></Backdrop>)
    }
}