import React, { useEffect, useReducer } from 'react';
import { Snackbar } from '../../material-modules';
import './toast.scss'
import { useSelector } from 'react-redux';
import { IToastStore } from '../../../interfaces/redux';
import { setGlobalToggleFunc } from '../../utils';
export default function ToastMessage() {
    const toastService : IToastStore = useSelector((state : any) => state.toastService)
    const [toastContext, setToastContext] = useReducer(setGlobalToggleFunc, { toast : false, type : null, timerId : false })
    useEffect(() => {
        if (toastService?.message == null || toastService?.message?.trim().length === 0) return;
        setToastContext({ toast : true, type : toastService.type })
        if(toastContext.timerId){
            clearTimeout(toastContext.timerId)
        }
        setToastContext({ timerId : setTimeout(() => setToastContext({ toast : false }), 2500)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[toastService?.rand])
    
    return <Snackbar open={toastContext.toast}>
        <div className={toastContext.type ? 'toast-message success-message' : 'toast-message error-message'} dangerouslySetInnerHTML={{ __html: `${toastService.message}` }}></div>
    </Snackbar>
}