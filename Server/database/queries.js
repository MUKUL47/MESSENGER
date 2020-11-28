class Social{
    static initOrUpdateSocial = (id, fromId, date) => 
    `INSERT INTO social(id, friend_id, created_at)  VALUES('${id}', '${fromId}', '${date}')`

    // static removeRequest = id => 
}

class Common{
    static globalDeleteReference = (tableName, object) => `DELETE FROM ${tableName} where ${object}`
}

class Users{
    constructor(id, updated_at, created_at, identity, keygen){
        this.id = id
        this.updated_at = updated_at
        this.created_at = created_at
        this.identity = identity
        this.keygen = keygen
    }
}

class Verifications{
    constructor(id, updated_at, created_at, identity, keygen){
        this.id = id
        this.updated_at = updated_at
        this.created_at = created_at
        this.identity = identity
        this.keygen = keygen
    }
}

class Response {
    constructor(status, message, time, route){
        this.status = status
        this.message = message
        // this.errorMessageCode = errorMessageCode
        this.time = time
        this.route = route
    }
}
module.exports.users = Users;
module.exports.Social = Social;
module.exports.Common = Common;
module.exports.Response = Response;