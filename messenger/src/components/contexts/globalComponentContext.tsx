
import React, { useEffect, useReducer, createContext } from 'react';
import { setGlobalToggleFunc } from '../../shared/utils';
export const GlobalContext = createContext<any>({} as any);
export default function GlobalContextData(props: any) {
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, { toast: { type: '', message: null, rand: -1 }, isLoading: false });
    const value = { get: toggle, set: setToggle };
    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    )
}