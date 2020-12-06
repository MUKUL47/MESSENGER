import React, { useContext, useEffect } from 'react';
import { SENT_EVENTS } from '../../../../shared/models/socketevents';
import { eventEmitter } from '../../../../shared/utils';
import { SocketContext } from '../../../contexts/socketContext';
import ChatSectionRender from './ui/chatsectionrender';
export default function ChatSection() {
    const socket: any = useContext(SocketContext);
    useEffect(() => {
        // eventEmitter.subscribe(response => {
        //     console.log('response.event-',response.event)
        //     console.log('response.event-', response.params)
        // })
        // socket.sendEvent(SENT_EVENTS.REFRESH_FRIEND_LIST)
    }, [])
    return (<ChatSectionRender />)
}