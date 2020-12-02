import React from 'react';
import './chatarea.scss'
import { TextField, SendIcon } from '../../../../../../shared/material-modules';
const convos = 'e 1960s witith the relh the relith itith the relh the relthith ith the relthe rith the relele releith the relase of Letraset s'
export default function ChatAreaRender() {
    return (
        <div className="chatarearender-layout">
            <div className="chatting-area"><Chats /></div>
            <div className="submit-message">
                <TextField
                    id="outlined-basic"
                    placeholder="Enter Message"
                    variant="outlined"
                    className="message-inp"
                />
                <SendIcon className="send-icon" />
            </div>
        </div>)
}
function Chats() {
    let lastChunk: any = '';
    return <div className="chatarea">
        {
            Array(212).fill(1).map((c: any) => {
                const dir = Math.floor(Math.random() * 100) % 2 === 0 ? 'left' : 'right';
                const cc = dir === 'left' ? 'c-tip-left' : 'c-tip-right';
                const tip = lastChunk != dir ?
                    (<div className={"c-tip " + cc}>
                        <div>
                            <Msgc />
                        </div>
                    </div>)
                    :
                    null;
                lastChunk = dir;
                return (
                    <div className={tip ? 'chat-mg-t' : ''}>
                        <div className={dir === 'left' ? 'chatarea-type__left chat-chunk' : 'chatarea-type__right chat-chunk'}>
                            {convos}
                            {tip}
                        </div>
                    </div>
                )
            }
            )
        }
    </div>
}

function Msgc() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>
}