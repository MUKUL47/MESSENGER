import validator from 'validator';
import { Subject } from 'rxjs';
export const eventEmitter = new Subject<{ event: string, params: any }>();
export const toggleLoader = new Subject<boolean>();
export const toastMessage = new Subject<{ type: boolean, message: String, duration?: Number, logout?: boolean }>();
export const logoutService = new Subject();
export const setGlobalToggleFunc = (toggle: any, data: any) => {
    const currentKeys = Object.keys(toggle);
    Object.keys(data).forEach(key => {
        if (!currentKeys.includes(key)) throw Error('Unexpected property found :' + key)
    })
    return { ...toggle, ...data }
}
export const socketEvents = ['GOT_STATUS', 'GOT_MESSAGE', 'SENT_MESSAGE', 'TYPED'];
export const outGoingEvents = {
    OFFLINE : "OFFLINE",
    ONLINE : "ONLINE",
    SEND_MESSAGE : "SEND_MESSAGE",
    TYPE : "TYPE",
    IS_TYPING : "IS_TYPING",
    CONNECTION : "connect",
    DISCONNECT : "disconnect",
    ON_FRIEND_SELECT : 'ON_FRIEND_SELECT'
}
const numbers = '0123456789';
const alphabets = 'abcdefghijklmnopqrstuvwxyz';
export default class Utils {
    public static MAX_MESSAGE_LEN = 1187;
    public static validateEmailMobile(value: string): boolean {
        if (value.includes('@')) {
            return validator.isEmail(value);
        }
        return validator.isMobilePhone(value);
    }
    public static globalDefaultError = 'Unknown error occured'
    public static parseError = (e: any) => e?.response?.data ? (e?.response?.data?.message ? e?.response?.data?.message : Utils.globalDefaultError) : Utils.globalDefaultError
    public static getRandomNumber = (min: any, max: any) => { return Math.floor(Math.random() * (max - min) + min) };
    public static generateKey(len?:number) : string{
    const mix = numbers + alphabets + alphabets.toUpperCase()
        return Array(len || 12).fill(1).map(() => mix.charAt(Utils.getRandomNumber(0, mix.length))).join('')
    }
    public static convertBaseToBlob = (b64Data: string, mimeType: string) => {
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
}