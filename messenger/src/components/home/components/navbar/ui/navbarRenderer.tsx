import React, { useContext, useEffect, useReducer } from 'react';
import './navbar.scss'
import emptyProfile from '../../../../../assets/emptyProfile.webp';
import { SearchIcon, EmojiPeopleIcon, MeetingRoomIcon, Drawer, PersonIcon, HomeIcon } from '../../../../../shared/material-modules';
import Friends from '../../chatsection/friends/friends';
import { setGlobalToggleFunc } from '../../../../../shared/utils';
import { Link, useHistory } from 'react-router-dom';
import Routes from '../../../../../shared/routes';
import { UserContext } from '../../../../contexts/userContext';
export default function NavRenderer(props: any) {
    const userContext: any = useContext(UserContext);
    const { onLogout } = props;
    const navigate = useHistory();
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, { friendsDrawer: false, navBar: 'home' });
    const closeDrawer = () => setToggle({ friendsDrawer: false });
    const showFriendDrawer = () => {
        if (window.innerWidth > 700) return;
        setToggle({ friendsDrawer: true })
    };
    const closeAutoDrawer = () => {
        if (window.innerWidth >= 700) {
            closeDrawer()
        }
    }
    useEffect(() => {
        const path: string[] = window.location.pathname.split('/');
        setToggle({ navBar: path[path.length - 1] })
        window.addEventListener('resize', closeAutoDrawer);
        return () => window.removeEventListener('resize', closeAutoDrawer)
    }, []);
    const onNavSelect = (type: string) => {
        setToggle({ navBar: type });
        const url = `${type == 'home' || type == 'profile' ? `/${type}` : `${Routes.home}/${type}`}`;
        if (url === window.location.pathname) return
        navigate.push(url)
    }
    return (
        <div className="navrender-layout">
            <div className="navB">
                <img
                    id='myprof-img'
                    src={userContext.get.blob ? userContext.get.blob : emptyProfile}
                    width="50px"
                    height="50px"
                    onClick={e => showFriendDrawer()}
                />
            </div>
            <div
                className={calcC(toggle.navBar, 'home')}
                onClick={() => onNavSelect('home')}
            >
                <HomeIcon />
                <div id='nav-text'>Home</div>
            </div>
            <div className={calcC(toggle.navBar, 'profile')}
                onClick={() => onNavSelect('profile')}
            >
                <PersonIcon />
                <div id='nav-text'>Profile</div>
            </div>
            <div
                className={calcC(toggle.navBar, 'requests')}
                onClick={() => onNavSelect('requests')}
            >
                <EmojiPeopleIcon />
                <div id='nav-text'>Search</div>
            </div>
            <div
                onClick={onLogout}
                className={calcC(toggle.navBar, 'logout')}
            >
                <MeetingRoomIcon />
                <div id='nav-text'>Logout</div>
            </div>
            <FriendDrawer {...toggle} closeDrawer={closeDrawer} />
        </div >
    )
}

function FriendDrawer(props: any) {
    const { friendsDrawer, closeDrawer } = props;
    return (
        <div className="FriendDrawer">
            <Drawer anchor='left' open={friendsDrawer} onClose={e => closeDrawer()}>
                <Friends />
            </Drawer>
        </div>
    )
}

function calcC(navBar: string, type: string) {
    return `nav-btns ${navBar === type ? 'nav-btn__selected' : ''}`
}