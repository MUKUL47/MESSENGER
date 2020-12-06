const INCOMING_EVENTS = {
    OFFLINE: 'offline',
    IS_ONLINE: 'isOnline',
    CURRENT_ACTIVE_FRIENDS: 'currentActiveFriends',
    REFERSHED_FRIEND_LIST: 'refreshedFriendList',
    ON_NOTIFY: 'onNotify',
    LOGOUT: 'logout',
    SENT_MESSAGE: 'sentMessage',
    GOT_CONVERSATIONS: 'gotConversations',
    TYPING: 'typing',
    GOT_MESSAGE: 'gotMessage',

};
const SENT_EVENTS = {
    IS_TYPING: 'isTyping',
    ONLINE: 'online',
    REFRESH_FRIEND_LIST: 'refreshFriendList',
    NOTIFY: 'notify',
    GET_CONVERSATIONS: 'getConversations',
    SEND_MESSAGE: 'sendMessage'
}
export { SENT_EVENTS, INCOMING_EVENTS };