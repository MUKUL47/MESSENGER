import * as locker from 'crypto-js'
let ____strawBerryJuice : string = 'e8549b9afe253acc54f32ded80d31db8e67eb588ebb0741ae488be553911658e47b7c38ec87d7ef965ad8d3827eacf1c8901bfe87af853d1c96f237c603ef863';
export default class BermudaTriangle{
    public static setTriangle(key : string, value : string){
        const k = locker.AES.encrypt(key, ____strawBerryJuice).toString();
        const v = locker.AES.encrypt(value, ____strawBerryJuice).toString();
        localStorage.setItem(k, v)
    }
    public static clearTriangle(){
        localStorage.clear()
    }
    public static isFree(){
        return localStorage.length === 0
    }
    public static getTriangle(key : string){
        const k = locker.AES.encrypt(key, ____strawBerryJuice).toString();
        const eD = localStorage.getItem(k) as string
        const dK = locker.AES.decrypt(eD, ____strawBerryJuice).toString();
        return localStorage.getItem(dK) 
    }
}