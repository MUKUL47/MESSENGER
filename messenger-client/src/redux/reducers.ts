import { IAction } from "../interfaces/redux"
import Friend, { Message } from "../shared/services/messages.reducer"
import actions, { MESSAGE_ACTIONS, REQUEST_ACTIONS, TYPING_ACTIONS } from "./actions"
// const message = new Message()
function userStore(store = {}, action : IAction){
    if(actions.STORE_USER=== action.type){
        return { ...store, ...action.data }
    }
    else if(actions.RESET_USER === action.type){
        return {}
    }
    return store
}
function messagesStore(friend = new Friend(), action : IAction){
    if(action.type === MESSAGE_ACTIONS.ADD_FRIEND){
        const args = action.data;
        friend.addFriend(args)
    }
    else if(action.type === MESSAGE_ACTIONS.ADD_FRIENDS){
        const args = action.data;
        friend.addFriends(args)
    }
    else if(action.type === MESSAGE_ACTIONS.RESET_FRIENDS){
        friend = new Friend()
    }
    else if(action.type === MESSAGE_ACTIONS.SET_FRIEND_ACTIVE){
        const id = action?.data?.id
        friend.setFriendActive(id)
    }
    else if(action.type === MESSAGE_ACTIONS.REMOVE_FRIEND){
        const id = action?.data?.id
        if(friend.removeFriend(id)){
            friend.setFriendActive('')
        }
    }
    else if (action.type === MESSAGE_ACTIONS.ADD_MESSAGE) {
        const id = action?.data?.id
        const args = action.data.message;
        friend.addMessage(id, args);
    }
    else if (action.type === MESSAGE_ACTIONS.INITALIZE_MESSAGES) {
        const { id, messages, count } = action.data;
        friend.initMessages(id, messages, count);
    }
    else if (action.type === MESSAGE_ACTIONS.UPDATE_STATUS) {
        const { id, status } = action.data;
        friend.updateStatus(id,status);
    }
    return friend
}
function toastStore(store = {}, action : IAction){
    if(action.type === actions.TOAST_MESSAGE){
        return { message : action.data.message, type : action.data.type, rand : new Date().valueOf() }
    }
    return store
}
function loaderStore(store = {}, action : IAction){
    if(action.type === actions.SHOW_LOADER){
        return { id : new Date().valueOf(), type : true }
    }
    else if(action.type === actions.STOP_LOADER){
        return { id : new Date().valueOf(), type : false }
    }
    return store
}

function typingStore(store = {}, action : IAction){
    if(action.type === TYPING_ACTIONS.TYPED){
        const { id } = action.data;
        return { ...store, id : id, timestamp : new Date().valueOf() }
    }
    return store
}

function requestsStore(store = {ids : []}, action : IAction){
    if(action.type === REQUEST_ACTIONS.SET_REFRESH_FRIEND){
        if(action.data.id){
            (store.ids as any).push(action.data.id);
        }else{
            store.ids = [];
        }
        return { ...store }
    }
    return store
}

export { userStore, messagesStore, toastStore, loaderStore, typingStore, requestsStore }