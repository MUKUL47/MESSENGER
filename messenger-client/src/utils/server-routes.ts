const routes =  {
    BASE : 'http://localhost:8080',
    LOGIN : '/login',
    REGISTER : '/register',
    LOGOUT : '/logout',
    REFRESH : '/refresh',
    AUTH : '/auth',
    PROFILE : '/profile',
    AUTHORIZE : '/authorize',
    GOOGLE : 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000/thirdpartylogin&client_id=317523125768-tlh2b4ur3mbod03cu7f3gp4ripscms56.apps.googleusercontent.com',
    SOCIAL : {
        search : '/social/search',
        action : '/social/action/',
        network : '/social/network/'
    },
    MESSAGE : '/messages',
    clientAccessDenied: 'Session expired login again'
}
export default routes;