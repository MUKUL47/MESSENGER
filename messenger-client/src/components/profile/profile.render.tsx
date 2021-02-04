import React from 'react'
import { useDispatch } from 'react-redux'
import actions from '../../redux/actions';
export default function ProfileRender() {
    const dispatch = useDispatch();
    return (
        <div onClick={() => dispatch({ type : actions.SHOW_LOADER, data : { type : true } })}>
            ProfileRender
        </div>
    )
}
