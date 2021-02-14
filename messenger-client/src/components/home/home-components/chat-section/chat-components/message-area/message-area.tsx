import React, {useEffect, useReducer, useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MESSAGE_ACTIONS } from '../../../../../../redux/actions'
import { setGlobalToggleFunc, toastMessage } from '../../../../../../shared/utils'
import API from '../../../../../../utils/server'
import { SocketContext } from '../../../../socket.context'
import MessageAreaRender from './message-area.render'

export default function MessageArea() {
    const dispatch = useDispatch()
    const socketContext = useContext(SocketContext)
    debugger
    const { friends, activeFriendId } = useSelector((s : any) => s['messagesService']) 
    const contextData = {
        isLoading : false,
        selectedFriend : {},
        removeFriend : {}
    }
    const [messageContext, setMessageContext] = useReducer(setGlobalToggleFunc, contextData)
    useEffect(() => {
        if(activeFriendId){
            const f = friends.find((f:any)=> f.id === activeFriendId)
            if(f){
                setMessageContext({ selectedFriend : f })
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
    return (
        <MessageAreaRender 
            {...messageContext} 
            friends={friends} 
            activeFriend ={activeFriendId}
            onRemoveFriend={onRemoveFriend}
        />
    )
}
