import React, { useContext } from 'react'
import './profile.scss'
import defaultProfile from '../../../../assets/images/emptyProfile.webp'
import Drawer from '@material-ui/core/Drawer';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import PersonIcon from '@material-ui/icons/Person';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Api } from '../../../../shared/components/calls/server'
import PeopleIcon from '@material-ui/icons/People';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { AddFriends } from './add-friends/addFriends'
import { EmojiPeopleIcon } from '../../../../shared/components/material-ui-modules'
import { RequestController } from './requests/requestController'
import { SocketContext } from '../socketCommunication/socketContext'
import { Subject } from 'rxjs'
export const logoutSubject = new Subject()

export class Profile extends React.Component {
    socketContext = SocketContext
    constructor(props) {
        super(props)
        this.state = {
            profileExpanded: false,
            addFriendsOpen: false,
            requestsTabOpen: false
        }
        console.log(props)
    }
    render() {
        return (this.profileSection())
    }

    profileSection() {
        const profileImage = this.props.image_blob ?
            <img id='profileImage' src={this.props.image_blob} />
            : (this.props.name ? <div id='profileDisplayNname'>
                <p id='p-profileName'>{this.props.name.substring(0, 1).toUpperCase()}</p>
            </div> : <img id='profileImage' src={defaultProfile} />)
        return (
            <>
                <div className='profile-header' hidden>
                    <PeopleIcon style={{ fontSize: '30px' }} id='white-c' onClick={this.props.friendCircleTrigger} />
                </div>
                <div className="profile-parent-layout">
                    <div className="profile-layout">
                        <div className="profile-name">
                            {this.props.name ? this.props.name : ''}
                        </div>
                        <div className="profile-image" onClick={e => this.toggleProfileExtra(true)}>
                            {profileImage}
                        </div>
                    </div>
                    <div className='profile-extra'>
                        {this.profileExtra()}
                    </div>
                    <div className='add-friends'>
                        {
                            this.state.addFriendsOpen ?
                                <AddFriends
                                    isOpen={this.state.addFriendsOpen}
                                    closed={e => this.onFriendsToggle(false)}
                                /> : null
                        }
                    </div>
                    <div className='requests-tab'>
                        {this.state.requestsTabOpen ? <RequestController onClose={e => this.setState({ ...this.state, requestsTabOpen: false })} /> : null}
                    </div>
                </div>
            </>
        )
    }

    toggleProfileExtra(val) {
        this.setState({ ...this.state, profileExpanded: val })
    }

    profileExtra() {
        const drawer = this.state.profileExpanded ? 'profile-drawer-img rotate-180' : 'profile-drawer-img'
        return (
            <div>
                <Drawer id='profile-drawer' anchor='right' open={this.state.profileExpanded} onClose={e => this.toggleProfileExtra(false)}>
                    <div className="profile-extra-drawer">
                        <div onClick={e => this.toggleProfileExtra(false)} className='arrow-icon'>
                            <KeyboardBackspaceIcon className={drawer} />
                        </div>
                        <div className="profile-drawer-btns">
                            {this.profileDrawer()}
                        </div>
                    </div>
                </Drawer>
            </div>
        )
    }
    profileDrawer() {
        return (
            <div>
                <Divider id='divider' />
                <ListItem onClick={this.myProfile} button>
                    <ListItemIcon><PersonIcon id='white-c' /></ListItemIcon>
                    <ListItemText id='white-c' primary="My profile" />
                </ListItem>
                <Divider id='divider' />
                <ListItem onClick={this.logout} button >
                    <ListItemIcon ><ExitToAppIcon id='white-c' /></ListItemIcon>
                    <ListItemText id='white-c' primary="Logout" />
                </ListItem>
                <Divider id='divider' />
                <ListItem onClick={e => this.onFriendsToggle(true)} button >
                    <ListItemIcon ><PersonAddIcon id='white-c' /></ListItemIcon>
                    <ListItemText id='white-c' primary="Add friends" />
                </ListItem>
                <Divider id='divider' />
                <ListItem onClick={e => this.setState({ ...this.state, requestsTabOpen: true })} button >
                    <ListItemIcon ><EmojiPeopleIcon id='white-c' /></ListItemIcon>
                    <ListItemText id='white-c' primary="Requests" />
                </ListItem>
                <Divider id='divider' />
            </div>
        )
    }

    logout = async () => {
        try {
            this.toggleProfileExtra(false)
            await Api.logout(localStorage.getItem('id'))
            localStorage.clear()
            // logoutSubject.next()
            this.props.history.push({ pathname: '/' })
        } catch (ee) {
            localStorage.clear()
            // logoutSubject.next()
            this.props.history.push({ pathname: '/' })
        }
        setTimeout(() => window.location.reload(), 50)
    }

    myProfile = e => {
        this.props.history.push({ pathname: '/profile', state: this.getProfileState('My Profile') })
    }

    onFriendsToggle(val) {
        if (!this.props.name) {
            this.props.history.push({ pathname: '/profile', state: this.getProfileState('Create profile to add friends') })
            return
        }
        this.setState({ ...this.state, addFriendsOpen: val })
    }

    getProfileState(header) {
        return {
            name: this.props.name ? this.props.name : false,
            image: this.props.image_blob ? this.props.image_blob : false,
            identity: Object.keys(localStorage)[0],
            redirectUrl: '/home',
            submitVal: 'Done',
            isFromHome: true,
            header: header
        }
    }
}