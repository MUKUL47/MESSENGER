const url = {
    base: 'http://192.168.0.8:9999',
    base_: `http://localhost:9999`,
    register: '/register',
    otp: '/otp',
    login: '/login',
    logout: '/logout',
    thirdPartyAuth: '/thirdparty',
    profile: {
        myProfile: '/myprofile',
        get: '/profile',
        update: '/updateprofile'
    },
    social: {
        get: '/social/search/',
        network: '/social/network',// social/network/:type/:start/:count',
        requests: '/social/requests',
        send: '/social/send',
        respond: '/social/respond',// /social/respond/someone123/1(yes)|0(no)
        remove: '/social/remove',
        revoke: '/social/revoke', // /social/delete/1(block)|0(delete)/123MU123
        getStatus: '/social/status'
    },
    googleOauth: 'https://www.googleapis.com/gmail/v1/users/me/profile',
    thirdpartylogin: '/thirdpartylogin',
    clientAccessDenied: 'Login First'
}

export { url }