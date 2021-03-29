
import React, { useEffect, createContext, useState } from 'react';
import { eventEmitter, outGoingEvents, socketEvents } from '../../shared/utils';
import io from "socket.io-client";
import serverRoutes from '../../utils/server-routes';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_ACTIONS } from '../../redux/actions';
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    const { id } = useSelector((s : any) => s['userService']) 
    const [event, setEvent] = useState<any>(null);
    const dispatch = useDispatch()
    useEffect(() => {
        const socketEvent = (io as any)(serverRoutes.BASE);
        const sendEvent = (key: string, data: any) => socketEvent.emit(key, data) //sender
        socketEvent.on('connect',() => {
            if(!event){
                setEvent(sendEvent)
            }
            socketEvent.emit(outGoingEvents.ONLINE, { args : id })
        })
        socketEvents.forEach((event: string) => socketEvent.on(event, (params: any) => {
            if (params.event === 'SENT_MESSAGE' ||params.event === 'GOT_MESSAGE') {
                const message = params.message;
                dispatch({ type : MESSAGE_ACTIONS.ADD_MESSAGE, data : { id : params.event === 'SENT_MESSAGE' ? message.targetId : message.userId, message : message } })
            }
        })) //listener
    }, [])
    return (
        <SocketContext.Provider value={event}>
            {props.children}
        </SocketContext.Provider>
    )
}