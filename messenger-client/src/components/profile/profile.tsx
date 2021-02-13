import React, { useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import Routes from '../../utils/routes';
import API from '../../utils/server';
import Utils, { setGlobalToggleFunc, toastMessage } from '../../shared/utils';
import ProfileRenderer from './profile.render';
import { useSelector, useDispatch } from 'react-redux';
import { IUserStore } from '../../interfaces/redux';
import actions from '../../redux/actions';
import BermudaTriangle from '../../shared/localstorage.service';
export default function Profile() {
    const userStore : IUserStore = useSelector((state : any) => state.userService)
    const dispatch = useDispatch()
    const history = useHistory();
    const stateData = { loading: true, name: '', blob: null, user: userStore.id , profileTouched: {} };
    const [state, setState] = useReducer(setGlobalToggleFunc, stateData);
    const updateProfile = async () => {
        try {
            if (Object.keys(state.profileTouched).length > 0) {
                setState({ loading: true })
                let params = [state.name, state.blob];
                if (!state.profileTouched.blob) {
                    params.pop();
                }
                await API.updateProfile(state.name)
                setState({ loading: false })
                const dispatchData = { name: state.name, blob: state.blob }
                dispatch({ type : actions.STORE_USER, data : dispatchData })
                toastMessage.next({ type: true, message: 'Profile updated successfully' });
            }
            history.push(Routes.home)
        } catch (e) {
            setState({ loading: false })
            toastMessage.next({ type: false, message: e, duration: 2000 })
        }
    }
    const getProfile = async () => {
        document.title = 'Messenger - Profile';
        console.log(userStore);
        if (BermudaTriangle.isFree()) {
            history.push(Routes.login);
        }
        else if (!userStore.name) {
            try {
                setState({ loading: true })
                const profileResponse: any = await API.getProfile();
                const profile = profileResponse.data?.message;
                setState({ loading: false })
                let dispatchData = {}
                if (profile.displayName) {
                    // const blob = null//`${profile.image_blob}` == 'null' ? null : profile.image_blob;
                    dispatchData = { name: profile.displayName, image: null , identity : profile.identity }
                } else {
                    dispatchData = { name: profile.displayName, id: profile.id, identity : profile.identity }
                }
                setState({ loading: false, name: profile.displayName, blob: null, user: profile.identity })
                dispatch({ type : actions.STORE_USER, data : dispatchData})
                } catch (e) {
                setState({ loading: false })
                toastMessage.next({ type: false, message: e })
            }
        } else {
            setState({ loading: false, name: userStore.name, blob: userStore.image, user: userStore.identity })
        }
    }
    useEffect(() => { getProfile(); }, [])
    return (<ProfileRenderer {...state} updateProfile={updateProfile} setForm={setState} />)
}