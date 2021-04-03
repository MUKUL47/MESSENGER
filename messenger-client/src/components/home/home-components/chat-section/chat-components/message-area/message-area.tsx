import React, {useEffect, useReducer, useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IMessage } from '../../../../../../interfaces/data-models'
import { MESSAGE_ACTIONS } from '../../../../../../redux/actions'
import { eventEmitter, outGoingEvents, setGlobalToggleFunc, toastMessage } from '../../../../../../shared/utils'
import API from '../../../../../../utils/server'
import { SocketContext } from '../../../../socket.context'
import MessageAreaRender from './message-area.render'

export default function MessageArea() {
    const dispatch = useDispatch()
    const { event, error } = useContext(SocketContext)
    const { friends, activeFriendId, selectedFriend, addedMessage, id, messageRandom } = useSelector((s : any) => { return {...s['messagesService'], ...s['userService']}}) 
    const contextData = {
        isLoading : false,
        selectedFriend : {},
        removeFriend : {},
        newFriendSelected : false
    }
    const [messageContext, setMessageContext] = useReducer(setGlobalToggleFunc, contextData)
    useEffect(() => {
        if(activeFriendId){
            const f = friends.find((f: any) => f.id === activeFriendId)
            if(f){
                setMessageContext({ selectedFriend: f, newFriendSelected : true })
                if (!f.init) {
                    const { cancel, promise } = API.getMessages(f.id);
                    promise.then(response => {
                        const messages = response?.data?.message?.messages || [];
                        dispatch({ type : MESSAGE_ACTIONS.INITALIZE_MESSAGES, data : { id : f.id, messages : messages } })
                    })
                }
                // cancel()
            }
        }
    }, [activeFriendId, friends])
    async function onRemoveFriend(id : string) {
        if(messageContext.removeFriend[id]) return
        if(window.confirm('Are you sure ?')){
            const o : any = {};
            o[id] = true;
            setMessageContext({ removeFriend : {...messageContext.removeFriend, ...o} })
            try{
                await API.networkAction('remove', id)
                toastMessage.next({ type : true, message : 'User removed' })
                dispatch({ type : MESSAGE_ACTIONS.REMOVE_FRIEND, data : { id : id } })
            }catch(e){
                toastMessage.next({ type : false, message : e })
                const cO = {...messageContext.removeFriend}
                delete cO[id]
                setMessageContext({ removeFriend : {...cO} })
            }
        }
    }

    async function fetchMessages(){
        try{
            
        }catch(e){
            toastMessage.next({ type : false, message : 'Failed to load conversations' })
        }
    }

    async function sendMessage(message: string) {
        const msg : IMessage ={
            createdAt: new Date().valueOf().toString(),
            friendId: activeFriendId,
            id: '123',
            message: message,
            ownerId: '1',
            status : 'true'
        }
        setMessageContext({newFriendSelected : false })
        event.emit(outGoingEvents.SEND_MESSAGE, { message , userId : id, targetId : msg.friendId, id : Math.random()})
        // dispatch({ type : MESSAGE_ACTIONS.ADD_MESSAGE, data : { id : msg.friendId, message : msg } })
    }

    function typed(){
        event.emit(outGoingEvents.IS_TYPING, { id : id, friendId : selectedFriend.id})
    }
    return (
        <MessageAreaRender 
            {...messageContext} 
            friends={friends} 
            activeFriend ={activeFriendId}
            onRemoveFriend={onRemoveFriend}
            sendMessage={sendMessage}
            userTyped={typed}
            friend={selectedFriend}
            addedMessage={addedMessage}
            messageRandom={messageRandom}
        />
    )
}
