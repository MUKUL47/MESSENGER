import sR from './server-routes'
import axios, { AxiosRequestConfig } from 'axios'
import Utils, { toastMessage } from '../shared/utils';
import BermudaTriangle from '../shared/localstorage.service';
export default class API{
    public static nonSecretEndPoints = [sR.BASE + sR.LOGIN, sR.BASE + sR.REGISTER, sR.BASE + sR.LOGIN, sR.BASE + sR.AUTHORIZE]
    public static initApiInterceptor() {
        axios.interceptors.request.use(
            (config: any) => {
                if (!this.nonSecretEndPoints.includes(config.url)) {
                    const token = BermudaTriangle.getTriangle('token');
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
                axios.get(sR.BASE + sR.REFRESH + `?token=${BermudaTriangle.getTriangle('refreshToken')}`). 
                then(response => {
                    if(response.status === 200 && response.data?.message){
                        BermudaTriangle.setTriangle('refreshToken', response.data?.message?.refresh_token)
                        BermudaTriangle.setTriangle('token', response.data?.message?.token)
                        // return axios(pendingRequest)
                        window.location.reload()
                    }else{
                        BermudaTriangle.clearTriangle()
                        toastMessage.next({ message: 'Re-Login again', type: false, duration: 5000, logout: true });
                    }
                }). 
                catch(e => {
                    BermudaTriangle.clearTriangle()
                    toastMessage.next({ message: 'Re-Login again', type: false, duration: 5000, logout: true });
                })
            }
            return Promise.reject(error);
        });
    }
    public static login(identity : string, isOtp : boolean, otp ?:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { identity : identity, otp :  isOtp ? otp : null}
            axios.post(sR.BASE+sR.LOGIN, body).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
        })
    }

    public static register(identity : string, isOtp : boolean, otp ?:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            const body = { identity : identity, otp :  isOtp ? otp : null}
            axios.post(sR.BASE+sR.REGISTER, body).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
        })
    }

    public static getProfile(id ?: string[]) : Promise<any> {
        return new Promise((resolve, reject) => {
            const url = sR.BASE+sR.PROFILE
            if(!id){
                return axios.get(url).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
            }
            axios.post(url, id).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
        })
    }

    public static updateProfile(name : string): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.put(sR.BASE+sR.PROFILE, { displayName : name }).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
        })
    }

    public static getNetwork(type : string, start : number = 0, count : number = 10) : Promise<any> {
        return new Promise((resolve, reject)=>{
            const url = sR.BASE+sR.SOCIAL.network+type+`?start=${start}&count=${count}`
            axios.get(url).then((response: AxiosRequestConfig) => resolve(response)).catch(e => reject(Utils.parseError(e)))
        })
    }

}