import { combineReducers } from "redux";
import { messagesStore, toastStore, userStore, loaderStore } from "./reducers";
export default combineReducers({ toastService : toastStore, messagesService : messagesStore, userService : userStore, loaderService : loaderStore })