import React, { useEffect, useReducer } from 'react';
import './navbar.scss'
import emptyProfile from '../../../../../assets/emptyProfile.webp';
import { SearchIcon, EmojiPeopleIcon, MeetingRoomIcon, Drawer, PersonIcon, HomeIcon } from '../../../../../shared/material-modules';
import Friends from '../../chatsection/friends/friends';
import { setGlobalToggleFunc } from '../../../../../shared/utils';
import { Link, useHistory } from 'react-router-dom';
import Routes from '../../../../../shared/routes';
export default function NavRenderer(props: any) {
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
        console.log('->',)
        window.addEventListener('resize', closeAutoDrawer);
        return () => {
            window.removeEventListener('resize', closeAutoDrawer)
        }
    }, []);
    const onNavSelect = (type: string) => {
        setToggle({ navBar: type });
        navigate.push(`${type === 'home' ? '' : Routes.home}/${type}`);
    }
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
            <Link
                to={Routes.home}
                className={calcC(toggle.navBar, 'home')}
                onClick={() => setToggle({ navBar: 'home' })}
            >
                <HomeIcon />
                <div id='nav-text'>Home</div>
            </Link>
            <Link
                to={`/profile`}
                className={calcC(toggle.navBar, 'profile')}
            >
                <PersonIcon />
                <div id='nav-text'>Profile</div>
            </Link>
            {/* <Link
                to={Routes.home + `/search`}
                className={calcC(toggle.navBar, 'search')}
                onClick={() => setToggle({ navBar: 'search' })}
            >
                <SearchIcon />
                <div id='nav-text'>Search</div>
            </Link> */}
            <Link
                to={Routes.home + `/requests`}
                className={calcC(toggle.navBar, 'requests')}
                onClick={() => setToggle({ navBar: 'requests' })}
            >
                <EmojiPeopleIcon />
                <div id='nav-text'>Search</div>
            </Link>
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