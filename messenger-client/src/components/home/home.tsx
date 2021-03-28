import React, { useEffect, useReducer } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IResponse } from '../../interfaces/data-models';
import actions from '../../redux/actions';
import { setGlobalToggleFunc, toastMessage } from '../../shared/utils'
import API from '../../utils/server';
import HomeRender from './home.render'
export default function Home() {
    const dispatch = useDispatch()
    const history = useHistory();
    const userService = useSelector((s : any) => s['userService'])
    const contextData = {
        profileReady : false,
        isLoading : true
    }
    const [homeContext, setHomeContext] = useReducer(setGlobalToggleFunc, contextData)
    // async function fetchProfile(){
    //     try{
    //         const profileResponse : IResponse = await API.getProfile()
    //         const profile = profileResponse?.data?.message || {}
    //         const dispatchData = { name : `${profile.displayName || ''}`, id : profile.id, identity : profile.identity }
    //         dispatch({ type : actions.STORE_USER, data : dispatchData })
    //         setHomeContext({ profileReady : `${dispatchData.name}`.trim().length > 0 ? true : false, isLoading : false })
    //     }catch(e){
    //         setHomeContext({ profileReady : false, isLoading : true })
    //         toastMessage.next({ message : e, type : false })
    //     }
    // }
    useEffect(() => {
        const profileName = userService?.name || '';
        // if(!userService?.name){
        //     fetchProfile()
        //     return
        // }
        setHomeContext({ profileReady : `${profileName}`.trim().length > 0, isLoading : false })
        
    },[])
    return (
        <HomeRender {...homeContext}/>
    )
}
