
import React, { useEffect, createContext, useState } from 'react';
import { eventEmitter, socketEvents } from '../../shared/utils';
import io from "socket.io-client";
import serverRoutes from '../../utils/server-routes';
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    const [event, setEvent] = useState<any>(null);
    useEffect(() => {
        const socketEvent = (io as any)(serverRoutes.BASE);
        socketEvent.on('connect',() => console.log('CONNECTED'))
        socketEvents.forEach((event: string) => socketEvent.on(event, (params: any) => eventEmitter.next({ event: event, params: params }))) //listener
        const sendEvent = (key: string, data: any) => socketEvent.emit(key, data) //sender
        setEvent(sendEvent);
    }, [])
    return (
        <SocketContext.Provider value={event}>
            {props.children}
        </SocketContext.Provider>
    )
}