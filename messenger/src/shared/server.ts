import axios from 'axios';
import { toastMessage } from './utils';
export const url = {
    base: `http://localhost:8081`,
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
    },
    MESSAGE : '/messages',
    googleOauth: 'https://www.googleapis.com/gmail/v1/users/me/profile',
    thirdpartylogin: '/thirdpartylogin',
    clientAccessDenied: 'Login First'
}
export default class Api {
    public static nonSecretUrls = [
        url.base + url.LOGIN,
        url.base + url.REGISTER,
        url.base + url.AUTHORIZE
    ];

    public static initApiInterceptor() {
        console.log("intercepting --", 'config')
        axios.interceptors.request.use(
            (config: any) => {
                ;
                if (!this.nonSecretUrls.includes(config.url)) {
                    const lS = localStorage.getItem('secret');
                    if (!lS) {
                        // Promise.reject({
                        //     type: "intercept",
                        //     message: url.clientAccessDenied,
                        // });
                        toastMessage.next({ message: 'Session timed out', type: false, duration: 5000, logout: true });
                        return;
                    }
                    config.headers = { ...config.headers, secret: lS, type: "web" };
                    return config;
                }
                config.headers = { ...config.headers, type: "web" };
                return config;
            },
            (error) => {
                console.log(error);
                Promise.reject({ type: "intercept", message: url.clientAccessDenied });
            }
        );

        axios.interceptors.response.use((null as any), (error) => {
            console.log(error.type)
            if (
                error.response &&
                error.response.status === 401 &&
                !this.nonSecretUrls.includes(error.config.url)
            ) {
                toastMessage.next({ message: 'Session timed out', type: false, duration: 5000, logout: true });
            }
            return Promise.reject(error);
        });
    }

    public static generateOtp(identity: String, isAuthorized: any) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.login;
            const body = { identity: identity, isAuth: isAuthorized };
            // let a = !isAuthorized ? delete body.isAuth : false;
            axios
                .post(finalUrl, body)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static verifyOtp(otp: String, identity: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.login;
            const body = { otp: otp, identity: identity };
            axios
                .post(finalUrl, body)
                .then((response) => {
                    console.log(response)
                    resolve(response)
                })
                .catch((err) => reject(err));
        });
    }

    public static logout(userId: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.logout;
            axios
                .get(finalUrl, { headers: { userId: userId } })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static getProfile(id: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.profile.get + `/${id}`;
            axios
                .get(finalUrl)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static updateProfile(name?: String, imageBlob?: Blob) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.profile.update;
            const body = { name: name, imageBlob: imageBlob };
            axios
                .put(finalUrl, body)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static sendRequest(id: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.send;
            axios
                .put(finalUrl, { toUserId: id })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static revokeRequest(id: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.revoke;
            axios
                .put(finalUrl, { toUserId: id })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static respondRequest(id: String, answer: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.respond;
            axios
                .put(finalUrl, { toUserId: id, answer: answer })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static removeUser(id: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.remove;
            axios
                .put(finalUrl, { toUserId: id })
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static getSocialStatus(id: String) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.getStatus + "/" + id;
            axios
                .get(finalUrl)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static getSocialStatuses(ids: String[]) {
        return new Promise((resolve, reject) => {
            const finalUrl = url.base + url.social.getStatus + "?id=" + ids.join(',');
            axios
                .get(finalUrl)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static getMyNetwork(type: String, start: Number, count: Number | String) {
        return new Promise((resolve, reject) => {
            const finalUrl =
                url.base + url.social.network + `/${type}/${start}/${count}`;
            axios
                .get(finalUrl)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    public static formatResponse(response: any) {
        if (response.status_code <= 201) {
            console.log(response);
            return response;
        }
        throw new Error(response.message);
    }

    public static getGoogleId(accessToken: String) {
        return axios.get(url.googleOauth, {
            headers: {
                Authorization: "Bearer " + accessToken,
                "content-type": "application/x--www-form-urlencoded",
            },
        });
    }

    public static thirdPartyAuthorization(type: String, token: String) {
        const finalUrl = url.base + url.thirdPartyAuth;
        return axios.get(finalUrl, { headers: { token: token, loginType: type } });
    }

    public static googleOauth =
        "https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/gmail.readonly&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=http://localhost:3000/thirdpartylogin&client_id=317523125768-tlh2b4ur3mbod03cu7f3gp4ripscms56.apps.googleusercontent.com";

    public static getUsers(displayName: String, startIndex: String | Number, totalCount: String | Number) {
        return new Promise((R, r) => {
            const finalUrl =
                url.base +
                url.social.get +
                `${displayName}/${startIndex}/${totalCount}`;
            axios
                .get(finalUrl)
                .then((resp) => R(resp))
                .catch((e) => r(e));
        });
    }
}