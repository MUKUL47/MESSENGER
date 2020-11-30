import React, { useEffect, useReducer } from 'react';
import { setGlobalToggleFunc } from '../../shared/utils';
import ProfileRenderer from './renderer';
export default function Profile() {
    const [globalToggle, setGlobalToggle] = useReducer(setGlobalToggleFunc, { isLoading : true });
    /**
     * 1) check local storage -> empty -> redirect
     * 2) check context -> empty? -> fetch profile (keep in loading state) -> store in context send profile in props
     * 3) check context -> data? -> pass the data in props
     */
    useEffect(() => {
        document.title = 'Messenger - Profile';
        setTimeout(() => setGlobalToggle({ isLoading : false }), 2000)
    },[])
    return (<ProfileRenderer loading={globalToggle.isLoading}/>)
}