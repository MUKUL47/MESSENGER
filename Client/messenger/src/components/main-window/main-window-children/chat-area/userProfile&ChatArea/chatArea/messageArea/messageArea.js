import React, { useContext, useState, useEffect } from 'react'
import './messageArea.scss'
import { ChatAreaContextData } from '../chatAreaContext'
import { FriendListContext } from '../../../../friends/friendListContext'
import * as moment from 'moment'
import * as lodash from 'lodash'
import { VisibilityIcon, VisibilityOffIcon, ErrorIcon } from '../../../../../../../shared/components/material-ui-modules'
export const MessageArea = props => {
    const chatAreaContextData = useContext(ChatAreaContextData)
    const friendListContext = useContext(FriendListContext)
    const selectedFriend = friendListContext.selectedFriendInChat.get
    const contextMessages = chatAreaContextData.message.get
    const messages = contextMessages.messages
    const typing = chatAreaContextData.typing.get;
    const [showMore, setShowMore] = useState({})
    const myId = localStorage.getItem('id')
    const setMore = id => {
        const sMore = {...showMore}
        sMore[id] = true;
        setShowMore(sMore)
    }
    const removeMore = id => {
        const sMore = {...showMore}
        delete sMore[id]
        setShowMore(sMore)
    }
    return(
    <div className='parentMessageArea'>
        {
            messages && messages.length > 0?
            messages.map((message, i) => 
                {
                    const isMy = message.author === myId
                    const isOverFlow = message.content.length > 310;
                    return (
                        <div className='mainMessageBlock' key={i}>
                            <div className={ message.status === 'pending' && isMy ? 'messageChunk s-pending' : 'messageChunk' } id={isMy ? 'mR' : 'mL'}>
                                {
                                    
                                    isOverFlow && !showMore[message._id]? 
                                    <div>
                                        {message.content.substring(0,310)+"..."}                                        
                                        <div>
                                            <VisibilityIcon 
                                                id='readMore' 
                                                onClick={e => setMore(message._id)}
                                            />
                                        </div>
                                    </div> : 
                                    <div>
                                        {message.content}
                                        {
                                            showMore[message._id] ? 
                                            <div>
                                                <VisibilityOffIcon 
                                                    id='readMore' 
                                                    onClick={e => removeMore(message._id)}
                                                />
                                            </div>  
                                            : 
                                            null
                                        }
                                    </div>
                                    
                                }   
                                <div className='dateBlock'>
                                    <div className='date'>
                                        {moment(new Date(message.createdAt)).format('DD MMM YY, hh:mm A')}
                                    </div>
                                </div>                             
                            </div>
                        </div>
                    )
                }
            ):
            <div id='noConversations'>
                <div>
                    <ErrorIcon/>
                </div>
                No Conversations found
            </div>
        }
    </div>
    )
}