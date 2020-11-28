import React, { useEffect } from 'react';
import { Snackbar } from '../../material-modules';
import './toast.scss'
export default function ToastMessage(props: any) {
    const { type, message } = props;
    return <Snackbar open={true}>
        <div className={type ? 'toast-message success-message' : 'toast-message error-message'}>{message}</div>
    </Snackbar>
}