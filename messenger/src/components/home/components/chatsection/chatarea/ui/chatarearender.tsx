import React from 'react';
import './chatarea.scss'
import { TextField, SendIcon } from '../../../../../../shared/material-modules';
export default function ChatAreaRender() {
    return (
    <div className="chatarearender-layout">
        <div className="chatting-area"></div>
        <div className="submit-message">
            <TextField
                id="outlined-basic"
                placeholder="Enter Message"
                variant="outlined"
                className="message-inp"
            />
            <SendIcon className="send-icon"/>
        </div>
    </div>)
}