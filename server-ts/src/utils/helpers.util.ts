import validator from "validator";
const numbers = '0123456789';
const alphabets = 'abcdefghijklmnopqrstuvwxyz';
export function isValidIdentity(identity : string) : boolean{
    if((identity.split('').indexOf('@') > -1)){
        return validator.isEmail(identity);
    }
    return validator.isMobilePhone(identity);
}
export function generateOtp(len ?:number) : string{
    return Array(len || 6).fill(1).map(() => numbers.charAt(getRand(0, 10))).join('')
}
export function generateKey(len?:number) : string{
    const mix = numbers + alphabets + alphabets.toUpperCase()
    return Array(len || 12).fill(1).map(() => mix.charAt(getRand(0, mix.length))).join('')
}
function getRand(max : number, min : number) : number{
    return Math.floor(Math.random() * (max - min) + min)
}