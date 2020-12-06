import React, { useEffect, useState } from 'react';
import { Snackbar } from '../../material-modules';
import './toast.scss'
export default function ToastMessage(props: any) {
    const { type, message, rand } = props;
    const [toast, setToast] = useState(false);
    useEffect(() => {
        if (message == null) return;
        setToast(true)
        setTimeout(() => setToast(false), 2500)
    }, [rand])
    return <Snackbar open={toast}>
        <div className={type ? 'toast-message success-message' : 'toast-message error-message'} dangerouslySetInnerHTML={{ __html: `${message}` }}></div>
    </Snackbar>
}