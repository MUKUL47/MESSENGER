import React from 'react'
import './mainWindow.scss'
import { FriendList } from './main-window-children/friends/friendList'
import { DefaultChatArea } from './main-window-children/chat-area/defaultChatArea'
import { Profile } from './main-window-children/profile/profile'
import { Api, globalMessages } from '../../shared/components/calls/server'
import { parseError } from '../../shared/components/utils/short'
import { SocketDataContext } from './main-window-children/socketCommunication/socketContext'
import { FriendListDataContext } from './main-window-children/friends/friendListContext'
import { RequestApi } from './main-window-children/profile/requests/requestApi'
export class MainWindow extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            profile : {
                // image : false,
                // displayName : false,
                // data : false,
                ...this.props,
                friendCircleTrigger : this.friendsHeaderTrigger
            },
            friendList : {
                isDrawer : false,
                closeFriendListDrawer : this.closeFriendListDrawer
            }
        }
        console.log(props)
    }

    componentWillMount(){
        if(localStorage.length == 0){
            this.props.history.push('/login')
        }else{
            this.saveProfile();
        }
    }

    async saveProfile(){
        try{
            const response = await Api.getProfile('_');
            localStorage.setItem('id',response.data[0]['id'])
            if(response.data[0]){
                this.setState({
                    ...this.state, 
                    profile : { ...this.state.profile, ...response.data[0]}})
            }
        }catch(ee){
            const err = parseError(ee)
            globalMessages.next({message : err})
        }
    }

    componentDidUpdate(){
    }

    render(){
        const element = 
        <div className = "main-window">
            <RequestApi>
                <FriendListDataContext>
                    <SocketDataContext>
                        {this.profileSection()}
                        {this.chatAndFriendSection()}
                    </SocketDataContext>
                </FriendListDataContext>
            </RequestApi>
        </div>;
        return element;
    }

    friendsHeaderTrigger = () => {
        this.setState({ ...this.state, friendList : { ...this.state.friendList, isDrawer : true } })
    }

    closeFriendListDrawer = () => {
        this.setState({ ...this.state, friendList : { ...this.state.friendList, isDrawer : false } })
    }

    profileSection(){
        return (
            <div className="profile-parent">
                <div className="profile">
                    <Profile {...this.state.profile}/>
                </div>
            </div>
        )
    }

    chatAndFriendSection(){
        return (
                    <div className="lower-section">
                        <div className='friend-section'>
                            <FriendList {...this.state.friendList}/>
                        </div>
                        <div className='chat-section'>
                            <DefaultChatArea/>
                        </div>
                    </div>
        )
    }
}