import React, { useContext, useEffect, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import Routes from '../../shared/routes';
import Api from '../../shared/server';
import Utils, { setGlobalToggleFunc, toastMessage } from '../../shared/utils';
import { UserContext } from '../contexts/userContext';
import ProfileRenderer from './renderer';
export default function Profile() {
    const history = useHistory();
    const userContext: any = useContext(UserContext);
    const userContextGet = userContext.get;
    const stateData = { loading: true, name: '', blob: null, user: localStorage.getItem('id'), profileTouched: {} };
    const [state, setState] = useReducer(setGlobalToggleFunc, stateData);
    const updateProfile = async () => {
        try {
            if (Object.keys(state.profileTouched).length > 0) {
                setState({ loading: true })
                let params = [state.name, state.blob];
                if (!state.profileTouched.blob) {
                    params.pop();
                }
                await Api.updateProfile(...params);
                setState({ loading: false })
                userContext.set({ name: state.name, blob: state.blob })
                toastMessage.next({ type: true, message: 'Profile updated successfully' });
            }
            history.push(Routes.home)
        } catch (e) {
            setState({ loading: false })
            toastMessage.next({ type: false, message: Utils.parseError(e), duration: 2000 })
        }
    }
    const getProfile = async () => {
        document.title = 'Messenger - Profile';
        if (localStorage.length === 0) {
            history.push(Routes.login);
        }
        else if (!userContextGet.name) {
            try {
                setState({ loading: true })
                const profileResponse: any = await Api.getProfile('_');
                const profile = profileResponse.data && profileResponse.data[0] ? profileResponse.data[0] : null;
                setState({ loading: false })
                if (profile) {
                    const blob = `${profile.image_blob}` == 'null' ? null : profile.image_blob;
                    userContext.set({ user: profile.identity, name: profile.name, blob: blob })
                    setState({ loading: false, name: profile.name, blob: blob, user: profile.identity })
                } else {
                    toastMessage.next({ type: false, message: 'Profile not set' })
                }
            } catch (e) {
                setState({ loading: false })
                toastMessage.next({ type: false, message: Utils.parseError(e), duration: 2000 })
            }
        } else {
            setState({ loading: false, name: userContextGet.name, blob: userContextGet.blob, user: userContextGet.user })
        }
    }
    useEffect(() => { getProfile(); console.log(userContextGet) }, [])
    return (<ProfileRenderer {...state} updateProfile={updateProfile} setForm={setState} />)
}