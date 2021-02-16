
import React, { useEffect, createContext, useState } from 'react';
import { eventEmitter, socketEvents } from '../../shared/utils';
import io from "socket.io-client";
import serverRoutes from '../../utils/server-routes';
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    const [event, setEvent] = useState<any>(null);
    useEffect(() => {
        const socketEvent = (io as any)(serverRoutes.BASE);
        const sendEvent = (key: string, data: any) => socketEvent.emit(key, data) //sender
        socketEvent.on('connect',() => {
            console.log(socketEvent.id)
            setEvent(sendEvent)
        })
        socketEvents.forEach((event: string) => socketEvent.on(event, (params: any) => {
            console.log(params)
            eventEmitter.next({ event: event, params: params })
        })) //listener
    }, [])
    return (
        <SocketContext.Provider value={event}>
            {props.children}
        </SocketContext.Provider>
    )
}