const validator = require('validator');

exports.timeout = time => new Promise( r => setTimeout(_ => r(), time));

exports.cbToPromise = ( func, params ) => new Promise(resolve => func(params, () => resolve()))

exports.defaultHeaders = {
    applicationJson : { 'content-type' : 'application/json' }
}

exports.getLocalStorage = key => {
    const obj = Object.keys(localStorage).filter(k => k === key)[0]
}

exports.checkSubStrMatch = (source, target) => {
    source = source.trim().toLowerCase()
    target = target.trim().toLowerCase()
    const tA = target.split('');
		const sA = source.split('');
		if(sA.length == 1 && tA.indexOf(sA[0]) > -1 || target == source || source.length == 0)  return true;
		if(source.length > target.length) return false;
		for(let i = 0; i < tA.length; i++){
			if(tA[i] == sA[0] && target.substr(i, source.length) == source){
				return true
			}
		}
		return false;
}

exports.validator =  (value, type) => {
    if(type == 'otp' && value+"".length.trim() == 6){
        return true;
    }
    if((value.split('').indexOf('@') > -1)){
        return validator.isEmail(value);
    }
    return validator.isMobilePhone(value);
}

exports.getRandomNumber  = (min, max) => { return Math.floor(Math.random() * (max - min) + min) };

exports.convertBaseToBlob = (b64Data, mimeType) => {
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: mimeType});
}

exports.GetterSetters = class GettersSetters{
    params = {};
    constructor(...params){
        const keys = params[0];
        const values = params[1];
        keys.map( (k, i) => this.params[k] = values[i] )
    }

    get(type){
        return this[`${type}`];
    }

    getAll(){
        return this;
    }

    set(types, value){
        types.forEach( (type, index) => this[`${type}`] = value[index] )
    }

    setIndividual(type, value){
        this[type] = value
    }
}
exports.globalDefaultError = 'Unknown error occured'
exports.parseError = e =>  e.response && e.response.data ? ( e.response.data.message ? e.response.data.message : this.globalDefaultError ) : this.globalDefaultError