import React, {useContext, useState} from 'react'
import { FriendListContext } from '../../../friends/friendListContext'
import './profileArea.scss'
import { defaultProfile, MoreVertIcon, Menu, MenuItem } from '../../../../../../shared/components/material-ui-modules'
import { ChatAreaContextData } from '../chatArea/chatAreaContext'
export const ProfileArea = props => {
    const chatAreaContext = useContext(ChatAreaContextData)
    const friendListContext = useContext(FriendListContext)    
    const [anchorEl, setAnchorEl] = useState(null);
    const friend = friendListContext.selectedFriendInChat.get
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const menuOption = option => {
    if(option === 'remove'){
        if(window.confirm(`remove ${friend.name} ?`)){
            //remove api call
        }
    }
    setAnchorEl(null);
  };

  const typing = chatAreaContext.typing && chatAreaContext.typing.get ===  friend.userId;
    return (
        <div className="ProfileArea">
            <div className="profile-image">
                <img src={friend.image ? friend.image : defaultProfile} id='profile-image'/>
            </div>
            <div className="profile-name">
                <p id='name'>{friend.name}{typing ? ' is typing...' : null}</p>
            </div>
            <div className="options-menu">
                <MoreVertIcon id='options' onClick={handleClick}/>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open    ={Boolean(anchorEl)}
                    onClose ={e => setAnchorEl(null)}
                >
                    <MenuItem onClick={e => menuOption('remove')}>Remove</MenuItem>
                </Menu>
            </div>
        </div>
    )
}