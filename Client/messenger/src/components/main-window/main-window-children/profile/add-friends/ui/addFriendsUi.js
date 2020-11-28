import React, { useState, useEffect } from 'react';
import { UserProfile } from './userProfile/userProfile'
import './addFriendsUi.scss'
import { 
    PersonAddIcon,
    Typography,
    TextField,
    CircularProgress,
    defaultProfile,
    Pagination,
    Tooltip,
    PersonAddDisabledIcon,
    PanToolIcon,
    CancelIcon,
    VisibilityIcon
} 
    from '../../../../../../shared/components/material-ui-modules'
import { Api, globalMessages } from '../../../../../../shared/components/calls/server';

export function AddFriendsUI(props){
    const [requestInProgress, setrequestInProgress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [userProfileToggle, setUserProfileToggle] = useState(false);
    setTimeout(() => {
    },10000)
    useEffect(() => {
        console.log('effect')
    })
    return(
    <div className="parent-friends">
        <div className="head-friend">
            <div className="search-friend">
                <Typography variant="h5" className="f-w-500" gutterBottom>
                    Search Friends
                </Typography>
            </div>
            <div className="search-friend">
                <TextField 
                    id="outlined-basic" 
                    className='searchInp f-w-500' 
                    label="Search" 
                    variant="outlined" 
                    value={searchQuery}
                    onKeyUp={e => { if(e.keyCode === 13){ props.onInputChange(searchQuery) }}}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="search-inProgress">
                {props.isFetching ? 
                <CircularProgress /> :
                null}
            </div>

            <div className="users-list">
                {props.isResults ? 
                renderResults(props) :
                null}
                {props.isResults && props.count > 1 ?
                <Pagination disabled={props.isFetching} className="pagination" 
                    count={props.count} 
                    onChange={props.onPageChange} /> :
                null}
                {
                    props.count === 0 ? 
                    <div className="no-users-name">No users found</div>
                    : null
                }
            </div>
        </div>
        {userProfileToggle ? 
            <UserProfile 
                close = {e => setUserProfileToggle(false)} 
                user = {userProfileToggle}
                requests = {props.requests}
            /> 
            : null
        }
    </div>)

function renderResults(props){
    const r = props.results.map((r, i) =>{
            return( 
            <div key={i}>
                <div className="user-block">
                   <div id="user-block">
                        <span id='user-image'>
                            <img id ='user-img' src={r.image ? r.image : defaultProfile}/>
                        </span>
                        <Tooltip title={'Joined on '+r.createdAt} placement="right-end">
                            <span id='user-username'>
                                {r.name}
                            </span>    
                        </Tooltip>                    
                        <span 
                            className={props.isFetching ? 'p-evt-none' : ''} 
                            id='user-add' 
                        >
                            <VisibilityIcon
                                id='user-add' 
                                onClick={e => getNetworkStatus(r)}
                            />
                            {/* {getRequestState(r)} */}
                        </span>
                   </div>
                </div>
            </div>)
        })
        return (
        <div className="scroll-user">
            {r}
        </div>
        )

        async function getNetworkStatus(r){
            try{
                const response = await Api.getSocialStatus(r.id)
                setUserProfileToggle({response : response.data[0], ...r})
            }catch(ee){
                // globalMessages.next({messsage : parseError(ee)})
            }
        }
        
    }
}


