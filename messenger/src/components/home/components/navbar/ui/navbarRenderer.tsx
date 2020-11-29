import React, { useEffect, useReducer } from 'react';
import './navbar.scss'
import emptyProfile from '../../../../../assets/emptyProfile.webp';
import { SearchIcon, EmojiPeopleIcon, CloseIcon, Drawer, PersonIcon } from '../../../../../shared/material-modules';
import Friends from '../../chatsection/friends/friends';
export default function NavRenderer() {
    const setToggleFunc = (toggle: any, data: any) => {
        return { ...toggle, ...data };
    }
    const [toggle, setToggle] = useReducer(setToggleFunc, { friendsDrawer : false });
    const closeDrawer = () => setToggle({friendsDrawer : false});
    const showFriendDrawer = () => {
        if(window.innerWidth > 700) return;
        setToggle({friendsDrawer : true})
    };
    const closeAutoDrawer = () => {
        if(window.innerWidth >= 700) {
            closeDrawer()
        }
    }
    useEffect(() => {
        window.addEventListener('resize',closeAutoDrawer);
        return () => {
            window.removeEventListener('resize', closeAutoDrawer)
        }
    },[])
    return (
    <div className="navrender-layout">
        <div className="navB">
            <img 
                id='myprof-img' 
                src={emptyProfile} 
                width="50px" 
                height="50px"
                onClick={e => showFriendDrawer()}
            />
        </div>
        <div className="nav-btns navB border-r">            
            <div id='nav-text'>Profile</div>
            <PersonIcon className="nav-icon"/>
        </div>
        <div className="nav-btns navB border-r">            
            <div id='nav-text'>Search</div>
            <SearchIcon className="nav-icon"/>
        </div>
        <div className="nav-btns navB">
            <div id='nav-text'>Requests</div>
            <EmojiPeopleIcon className="nav-icon"/>
        </div>
        {/* <div className="nav-btns navB">
            <div id='nav-text'>Logout</div>
            <CloseIcon className="nav-icon"/>
        </div> */}
        <FriendDrawer {...toggle} closeDrawer={closeDrawer}/>
    </div>
    )
}

function FriendDrawer(props : any){
    const {friendsDrawer, closeDrawer} = props;
    return(
    <div className="FriendDrawer">
        <Drawer anchor='left' open={friendsDrawer} onClose={e => closeDrawer()}>
            <Friends/>
        </Drawer>
    </div>
  )
}