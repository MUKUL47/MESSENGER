
import React, { useEffect, createContext, useState, useReducer } from 'react';
import { eventEmitter, outGoingEvents, setGlobalToggleFunc, socketEvents } from '../../shared/utils';
import io from "socket.io-client";
import serverRoutes from '../../utils/server-routes';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_ACTIONS, TYPING_ACTIONS } from '../../redux/actions';
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    const { id } = useSelector((s : any) => { return {...s['messagesService'], ...s['userService']}}) 
    const [socket, setSocket] = useReducer(setGlobalToggleFunc, { error : false, event : null });
    const dispatch = useDispatch()
    useEffect(() => {
        const socketEvent = (io as any)(serverRoutes.BASE);
        socketEvent.on('connect',() => {
            setSocket({event : socketEvent, error : false})
            socketEvent.emit(outGoingEvents.ONLINE, { args : id })
        })
        socketEvent.on('error',() => {
            setSocket({error : true, event : false})
        })
        socketEvent.on('disconnect',() => {
            setSocket({error : true, event : false})
        })
        socketEvents.forEach((event: string) => socketEvent.on(event, (params: any) => {
            if (params.event === 'SENT_MESSAGE' || params.event === 'GOT_MESSAGE') {
                const message = params.message;
                dispatch({ type : MESSAGE_ACTIONS.ADD_MESSAGE, data : { id : params.event === 'SENT_MESSAGE' ? message.targetId : message.userId, message : message } })
            }
            else if(event === 'GOT_STATUS'){
                const { status, friendId } = params;
                dispatch({ type : MESSAGE_ACTIONS.UPDATE_STATUS, data : { id : friendId, status } })
            }
            else if(event === 'TYPED'){
                dispatch({ type : TYPING_ACTIONS.TYPED, data : { id :  params.friendId } })
            }
        })) //listener
    }, [])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}