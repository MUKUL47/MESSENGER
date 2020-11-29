import React from 'react';
import './navbar.scss'
import emptyProfile from '../../../../../assets/emptyProfile.webp';
import { SearchIcon, PersonAddIcon, CloseIcon } from '../../../../../shared/material-modules';
export default function NavRenderer() {
    return (
    <div className="navrender-layout">
        <div className="navB">
            <img src={emptyProfile} width="50px" height="50px"/>
        </div>
        <div className="nav-btns navB border-r">            
            <div>Search</div>
            <SearchIcon className="nav-icon"/>
        </div>
        <div className="nav-btns navB border-r">
            <div>Requests</div>
            <PersonAddIcon className="nav-icon"/>
        </div>
        <div className="nav-btns navB">
            <div>Logout</div>
            <CloseIcon className="nav-icon"/>
        </div>
    </div>
    )
}