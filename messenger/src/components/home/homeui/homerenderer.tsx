import React from 'react';
import ChatSection from '../components/chatsection/chatsection';
import Navbar from '../components/navbar/navbar';
import './home.scss'
export default function HomeRenderer() {
    return (
    <div className="home-layout">
        <div className="navbar">
            <Navbar/>
        </div>
        <div className="chatsection">
            <ChatSection/>
        </div>
    </div>
    )
}