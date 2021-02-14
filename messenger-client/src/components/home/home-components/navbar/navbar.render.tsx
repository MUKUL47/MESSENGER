import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import BermudaTriangle from '../../../../shared/localstorage.service';
import { HomeIcon, PersonIcon, SearchIcon, MeetingRoomIcon } from '../../../../shared/material-modules'
import { logoutService } from '../../../../shared/utils';
import Routes from '../../../../utils/routes';
import './navbar.scss'
export default function NavbarRender() {
    const history = useHistory()
    const [navbarContext, setNavbarContext] = useState<string>('')
    useEffect(() => {
        const path: string[] = window.location.pathname.split('/');
        setNavbarContext(path[path.length - 1])
    }, []);
    useEffect(() => {
        const path: string[] = window.location.pathname.split('/');
        setNavbarContext(path[path.length - 1])
    },[navbarContext])
    const logout = () => logoutService.next()
    const onNavSelect = (type: string) : void => setNavbarContext(type)
    return (
        <div className="navbar">
            <div className="nav-items">
                <Link to="/home" className={navbarContext === 'home' ? 'nav--item nav-active' : 'nav--item'} onClick={() => onNavSelect('home')}>
                    <HomeIcon/>
                    <span>Home</span>
                </Link>
                <Link to="/profile"  className="nav--item" onClick={() => onNavSelect('profile')}>
                    <PersonIcon/>
                    <span>Profile</span>
                </Link>
                <Link to="/home/requests" className={navbarContext === 'requests' ? 'nav--item  nav-active' : 'nav--item'} onClick={() => onNavSelect('requests')}>
                    <SearchIcon/>
                    <span>
                        Search
                    </span>
                </Link>
                <div className="nav--item" onClick={logout}>
                    <MeetingRoomIcon/>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    )
}
