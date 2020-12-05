import React from 'react';
import './friends.scss'
import emptyProfile from '../../../../../../assets/emptyProfile.webp';
import { TextField, SearchIcon } from '../../../../../../shared/material-modules';
export default function FriendsRender() {
    return (
        <div className="friendsrender-layout">
            <div className="search-friends pad-b-10">
                <div className="search-txt">Search</div>
                <TextField
                    id="outlined-basic"
                    placeholder="Search Friends"
                    variant="outlined"
                    className="search-inp"
                />
                <SearchIcon className="search-icon" />
            </div>
            <div className="search-results">
                {
                    Array(102).fill(1).map((v, i) => {
                        return (
                            <div className="friend-fragment mar-b-10" key={i}>
                                <div className="profile-pic">
                                    <img id="profile-pic" src={emptyProfile} width="50px" height="50px" />
                                </div>
                                <div className="profile-details">
                                    <div id='p-name'>Mukul </div>
                                    <div id='frnd-status'><strong>ACTIVE</strong></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>)
}