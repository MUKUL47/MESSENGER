import React from 'react';
import { Backdrop, CircularProgress } from '../../material-modules';
export default function BackdropLoader(props: any) {
    const { open } = props;
    return (
        <Backdrop open={open} style={{ zIndex: 10000 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}