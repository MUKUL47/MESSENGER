
import React, { useEffect, useReducer, createContext } from 'react';
import { setGlobalToggleFunc } from '../../shared/utils';
export const ChatContext = createContext<any>({} as any);
export default function ChatContextData(props: any) {
    //global chat area logic
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, {});
    const value = { get: toggle, set: setToggle };
    return (
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    )
}