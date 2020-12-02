
import React, { useEffect, useReducer, createContext } from 'react';
import { setGlobalToggleFunc } from '../../shared/utils';
export const UserContext = createContext<any>({} as any);
export default function UserContextData(props: any) {
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, { user: null, name: null, blob: null });
    const value = { get: toggle, set: setToggle };
    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}