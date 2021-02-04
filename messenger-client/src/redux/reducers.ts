import { IAction } from "../interfaces/redux"
import actions from "./actions"
function userStore(store = {}, action : IAction){
    console.log(store)
    if(actions.STORE_USER){
        return { ...store, ...action.data }
    }
    return store
}
function messagesStore(store = [], action : IAction){
    return store
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