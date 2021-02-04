import sR from './server-routes'
import axios, { AxiosRequestConfig } from 'axios'
import Utils, { toastMessage } from '../shared/utils';
export default class API{
    public static nonSecretEndPoints = [sR.BASE + sR.LOGIN, sR.BASE + sR.REGISTER, sR.BASE + sR.LOGIN, sR.BASE + sR.AUTHORIZE]
    public static initApiInterceptor() {
        axios.interceptors.request.use(
            (config: any) => {
                if (!this.nonSecretEndPoints.includes(config.url)) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        toastMessage.next({ message: 'Session timed out', type: false, duration: 5000, logout: true });
                        return;
                    }
                    config.headers = { ...config.headers, token: token, type: "WEB-MESSENGER" };
                    return config;
                }
                config.headers = { ...config.headers, type: "WEB-MESSENGER" };
                return config;
            },
            (error) => Promise.reject({ type: "intercept", message: sR.clientAccessDenied })
        );
        axios.interceptors.response.use((null as any), (error : any) => {
            const pendingRequest = error.config;
            if (
                error?.response?.status === 401 &&
                !this.nonSecretEndPoints.includes(error.config.url) &&
                !pendingRequest._retry
            ) {
                pendingRequest._retry = true;
                return axios.get(sR.BASE + sR.REFRESH + `?token=${localStorage.getItem('refreshToken')}`). 
                then(response => {
                    if(response.status === 200 && response.data?.message){
                        localStorage.setItem('refreshToken', response.data?.message?.refresh_token)
                        localStorage.setItem('token', response.data?.message?.token)
                        return axios(pendingRequest)
                    }else{
                        toastMessage.next({ message: 'Session timed out', type: false, duration: 5000, logout: true });
                    }
                }). 
                catch(e => {
                    toastMessage.next({ message: 'Session timed out', type: false, duration: 5000, logout: true });
                })
            }
            return Promise.reject(error);
        });
    }
    public static login(identity : string, isOtp : boolean, otp ?:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { identity : identity, otp :  isOtp ? otp : null}
            axios.post(sR.BASE+sR.LOGIN, body).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(API.catchError(e)))
        })
    }

    public static register(identity : string, isOtp : boolean, otp ?:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { identity : identity, otp :  isOtp ? otp : null}
            axios.post(sR.BASE+sR.REGISTER, body).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(API.catchError(e)))
        })
    }

    public static getProfile(id ?: string[]) : Promise<any> {
        return new Promise((resolve, reject) => {
            const url = sR.BASE+sR.PROFILE
            if(!id){
                return axios.get(url).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(API.catchError(e)))
            }
            axios.post(url, id).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(API.catchError(e)))
        })
    }


    private static catchError(e : any){
        return Utils.parseError(e)
    }
}