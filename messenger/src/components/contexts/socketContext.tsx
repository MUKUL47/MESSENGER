
import React, { useEffect, useReducer, createContext } from 'react';
import { eventEmitter, setGlobalToggleFunc, socketEvents } from '../../shared/utils';
import io from "socket.io-client";
import Api, { url } from '../../shared/server';
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    //socket api logic
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, { sendEvent: null });
    const value = toggle;
    useEffect(() => {
        // const socketEvent = io(url.base);
        // socketEvents.forEach((event: string) => socketEvent.on(event, (params: any) => eventEmitter.next({ event: event, params: params }))) //listener
        // const sendEvent = (key: string, data: any) => socketEvent.emit(key, data) //sender
        // setToggle({ sendEvent: sendEvent });
        // console.log('events')
    }, [])
    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    )
}