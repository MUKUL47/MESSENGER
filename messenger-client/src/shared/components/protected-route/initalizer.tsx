import { Backdrop, CircularProgress } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import actions from '../../../redux/actions';
import Routes from '../../../utils/routes';
import API from '../../../utils/server';
import BermudaTriangle from '../../localstorage.service';

export default function Initalizer(props : any) {
    const { path } = props;
    const dispatch = useDispatch()
    const history = useHistory();
    async function fetchProfile() {
        try {
            const profileResponse: any = await API.getProfile();
            const profile = profileResponse.data?.message;
            dispatch({ type : actions.STORE_USER, data : {...profile, name : profile.displayName, id : profile.userId}})
            history.push(path, { skipAuth : true });
        } catch (e) {
            BermudaTriangle.clearTriangle();
            history.push(Routes.login);
        }
    }
    useEffect(() => {
        fetchProfile()
    }, [])
    return (
        <Backdrop open={true} style={{ zIndex: 10000 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}  
