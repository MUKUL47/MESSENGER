import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import HomeRenderer from './homeui/homerenderer';
export default function Home() {
    return (<HomeRenderer />)
}