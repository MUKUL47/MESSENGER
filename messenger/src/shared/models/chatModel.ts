import { act } from "react-dom/test-utils";

export default class ChatModel {
    public activeUser: string; //selected user
    public userTyping: string[] = [];
    public friends: { user: string, messages: any[] }[] = [];
    constructor(activeUser: string) {
        this.activeUser = activeUser;
    }
    //getters logic
}