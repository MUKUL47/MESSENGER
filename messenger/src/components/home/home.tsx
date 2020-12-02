import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import HomeRenderer from './homeui/homerenderer';
export default function Home() {
    const userContext: any = useContext(UserContext);
    useEffect(() => {
        console.log(userContext.get)
    }, [])
    return (<HomeRenderer />)
}