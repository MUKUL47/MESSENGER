import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { HomeIcon, PersonIcon, SearchIcon, MeetingRoomIcon } from '../../../../shared/material-modules'
import Routes from '../../../../utils/routes';
import './navbar.scss'
export default function NavbarRender() {
    const [navbarContext, setNavbarContext] = useState<string>('')
    const history = useHistory()
    useEffect(() => {
        const path: string[] = window.location.pathname.split('/');
        setNavbarContext(path[path.length - 1])
    }, []);
    useEffect(() => {
        // history.push(navbarContext)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navbarContext])
    function getNavClass(type : string){

    }    
    const onNavSelect = (type: string) : void => {
        setNavbarContext(type);
        const url = `/${type}`;
        if (url === window.location.pathname) return
        history.push(url)
    }
    return (
        <div className="navbar">
            <div className="nav-items">
                <div className="nav--item nav-active" onClick={() => onNavSelect('home')}>
                    <HomeIcon/>
                    <span>Home</span>
                </div>
                <div className="nav--item">
                    <PersonIcon/>
                    <span>Profile</span>
                </div>
                <div className="nav--item"  onClick={() => onNavSelect('requests')}>
                    <SearchIcon/>
                    <span>Search</span>
                </div>
                <div className="nav--item">
                    <MeetingRoomIcon/>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    )
}
