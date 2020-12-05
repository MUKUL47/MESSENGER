import React, { useEffect, useReducer, useState } from 'react';
import './chatarea.scss'
import bgChatImg from '../../../../../../assets/bg-chat.jpg'
import { TextField, SendIcon, Modal, Dialog } from '../../../../../../shared/material-modules';
import Utils, { setGlobalToggleFunc } from '../../../../../../shared/utils';
const convos = 'e 1960s w relele rel e  es w relele rel e  e relase of Les w reelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e  w relele rel e  e relas w relele rel e  e relas w relele rel e  e relas w relele rel e  e relasrelase of Les w relele rel s w relelele rel s w relele rel e  e relase of Lee  e relase of Les w relele rel e  e relase of Les w relele rel e  e relase of Le rerelele rel e  es w relele rel e  e relase of Les w reelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e  w relele rel e  e relas w relele rel e  e relas w relele rel e  e relas w relele rel e  e relasrelase of Les w relele rel s w relelele rel s w relele rel e  e relase of Lee  e relase of Les w relele rel e  e relase of Les w relele rel e  e relase of Le rerelele rel e  es w relele rel e  e relase of Les w reelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e relase of Les w relele rel s w releelele rel e  es w relele rel e  e  w relele rel e  e relas w relele rel e  e relas w relele rel e  e relas w relele rel e  e relasrelase of Les w relele rel s w relelele rel s w relele rel e  e relase of Lee  e relase of Les w relele rel e  e relase of Les w relele rel e  e relase of Le relase of Letraset s'

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
    const [showMessage, toggleMessage] = useState<any>({ open: false, message: '' });
    const showMessageToggle = (message: string): void => toggleMessage({ open: true, message: message });
    const [scrollDate, setScrollDate] = useReducer(setGlobalToggleFunc, { open: false, val: '', id: '' });
    const [hoverTimer, setHoverTimer] = useState<any>(null);
    let newChunk: string = '';
    useEffect(() => {
        return //performance issues optimize it
        (document.querySelector('.chatting-area') as any).addEventListener('scroll', () => {
            const elements: any = [...(document.getElementsByClassName('chatarea--when') as any)];
            if (elements && elements.length > 0) {
                let min = Infinity;
                let elem = -1;
                elements.forEach((el: any, idx: number) => {
                    const dif = 110 - Number(`${el.getClientRects()[0].y}`);
                    if (dif >= 0 && dif < min) {
                        min = dif;
                        elem = idx;
                    }
                });
                const dateText = (document.getElementsByClassName(elements[elem].className)[0]?.children[0] as any).innerText;
                setScrollDate({ val: dateText, id: elem, open: true });
                // setTimeout(() => {
                //     setScrollDate({ open: false })
                // }, 500);
            }
        });
    }, [])
    return <>
        {/* {
            scrollDate.open ?
                <div className='fixed-date'>
                    <div className="c-when-free">{scrollDate.val}</div>
                </div> :
                null
        } */}

        <div className="chatarea" id='chatarea'>
            {
                Array(12).fill(1).map((c: any, i) => {
                    const dir = i % 2 === 0 ? 'left' : 'right';
                    const tipClass = `c-tip ${dir === 'left' ? 'c-tip-left' : 'c-tip-right'}`;
                    const chatClass = `chat-chunk ${dir === 'left' ? 'chatarea-type__left' : 'chatarea-type__right'}`;
                    const tip = newChunk != dir ? (<div className={tipClass}><Msgc /></div>) : null;
                    newChunk = dir;
                    return (
                        <div key={i}>
                            <div className={`chatarea--when chatdate__${i}`}>
                                <p
                                // className={`c-when ${scrollDate?.open && scrollDate.id == i ? 'c-when__hide' : ''}`}
                                >
                                    {`Today ${i}`}
                                </p>
                            </div>
                            <div className={tip ? 'chat-mg-t' : ''}>
                                <div className={chatClass}>
                                    {
                                        convos.length > Utils.MAX_MESSAGE_LEN ?
                                            <>
                                                {`${convos.substring(0, Utils.MAX_MESSAGE_LEN)} ... `}
                                                <span className='chat--readmore' onClick={e => showMessageToggle(convos)}>
                                                    <strong>Read more</strong>
                                                </span>
                                            </> :
                                            convos} {tip}
                                    <div className="chat--time">23:59</div>
                                </div>
                            </div>
                        </div>

                    )
                })
            }
            <FullMessage {...showMessage} close={() => toggleMessage({ open: false })} />
        </div>
    </>

}

function Msgc() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" fill="#0000000" d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"></path><path fill="currentColor" d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"></path></svg>
}

function FullMessage(props: any) {
    const { open, message, close } = props;
    return <Dialog open={open} onClose={close}>
        {message}
    </Dialog>

}