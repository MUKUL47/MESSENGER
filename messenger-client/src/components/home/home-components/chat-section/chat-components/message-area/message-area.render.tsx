import React from 'react'
import defaultPic from '../../../../../../assets/emptyProfile.webp'
import './message-area.scss'
import { MoreVertIcon, TextField } from '../../../../../../shared/material-modules'
import selectUser from '../../../../../../assets/select-user.svg'
export default function MessageAreaRender() {
    return (
        false ?
        <div className="message-area-render">
            <div className="message-profile">
                <div className="selected-pro">
                    <div className="profile--pic">
                        <img src={defaultPic} className="d_ps" />
                    </div>
                    <div className="profile--name">
                        Mukul
                    </div>
                </div>
                <MoreVertIcon/>
            </div>
            <div className="messages-area">
                {
                    Array(20).fill(1).map(v => {
                        return <>
                        <div className={ Math.floor(Math.random()*100) % 2 === 0 ? 'message-area-friend' : 'message-area-me' }>
                            <p>
                                Lorem ipsum dolor, sit amet consectetur adipisicing
                                Lorem ipsum dolor, sit amet consectetur adipisicing
                                Lorem ipsum dolor, sit amet consectetur adipisicing
                                Lorem ipsum dolor, sit amet consectetur adipisicing
                            </p>
                        </div>
                        {/* <div className="message-area-friend">
                            <p>
                                Lorem ipsum dolor, sit amet consectetur adipisicing
                            </p>
                        </div> */}
                        </>
                    })
                }
            </div>
            <div className="send-message-area">
                <TextField 
                    id="outlined-basic" 
                    variant="outlined" 
                    rowsMax={2} 
                    multiline
                    placeholder="Type a message"
                    className="text-msg-inp"
                />
                <button className="default-input">Send</button>
            </div>
        </div>
        : <div className="message-area-render no-user-selected">
            <img src={selectUser} alt=""/>
            <p>Select a Friend and Start Chatting!</p>
        </div>
    )
}
