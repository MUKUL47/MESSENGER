import { IAction } from "../interfaces/redux"
import Friend, { Message } from "../shared/services/messages.reducer"
import actions, { MESSAGE_ACTIONS } from "./actions"
const message = new Message()
function userStore(store = {}, action : IAction){
    if(actions.STORE_USER){
        return { ...store, ...action.data }
    }
    return store
}
function messagesStore(friend = new Friend(), action : IAction){
    const args = action.data;
    if(action.type === MESSAGE_ACTIONS.ADD_FRIEND){
        friend.addFriend(args)
    }
    else if(action.type === MESSAGE_ACTIONS.ADD_FRIENDS){
        friend.addFriends(args)
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

export { userStore, messagesStore, toastStore, loaderStore }