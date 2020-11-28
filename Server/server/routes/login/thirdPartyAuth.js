const request = require('request')
const { routes } = require('../../../config')
const googleLogin = token => {
    return new Promise((resolve, reject) => {
        request(routes.thirdParty.google, { headers: { Authorization: "Bearer " + token, "content-type": "application/x--www-form-urlencoded"}}, (err, response, body) => {
            try{
                console.log(JSON.parse(body.toString('utf-8')))
                if(err || response.statusCode !== 200){
                    reject(err)
                    return;
                }
                resolve(JSON.parse(body.toString('utf-8'))['emailAddress'])
            }catch(err){
                reject(err)
            }
        })
    })
}

exports.thirdParty = (type, token) => {
    switch(type){
        case 'google' : return googleLogin(token)
    }
}