import React from 'react'
import './navbar.scss'
export default function NavbarRender() {
    return (
        <div className="navbar">
            <div className="nav-items">
                <div className="nav--item">Home</div>
                <div className="nav--item">Profile</div>
                <div className="nav--item">Search</div>
                <div className="nav--item">Logout</div>
            </div>
        </div>
    )
}
