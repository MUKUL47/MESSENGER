import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '../../material-modules';
import { useSelector } from 'react-redux';
import { ILoaderStore } from '../../../interfaces/redux';
export default function BackdropLoader() {
    const loaderService : ILoaderStore = useSelector((state : any) => state.loaderService)
    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => {
        setOpen(loaderService.type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaderService.id])
    return (
        <Backdrop open={open || false} style={{ zIndex: 10000 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}