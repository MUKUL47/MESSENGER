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
            // let dispatchData = {}
            // if (profile.displayName) {
            //     // const blob = null//`${profile.image_blob}` == 'null' ? null : profile.image_blob;
            //     dispatchData = { name: profile.displayName, image: null , identity : profile.identity }
            // } else {
            //     dispatchData = { name: profile.displayName, id: profile.id, identity : profile.identity }
            // }
            // debugger
            dispatch({ type : actions.STORE_USER, data : {...profile, name : profile.displayName}})
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
