export default {
    LOGIN : '/login',
    REGISTER : '/register',
    LOGOUT : '/logout',
    AUTH : '/auth',
    PROFILE : '/profile',
    AUTHORIZE : '/authorize',
    GOOGLE : 'https://www.googleapis.com/gmail/v1/users/me/profile',
    SOCIAL : {
        search : '/social/search',
        action : '/social/action/:type/:targetUser',
        network : '/social/network/:type'
    }
}