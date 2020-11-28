class MYSQL_TABLE {
    static CTINE = 'CREATE TABLE IF NOT EXISTS '
    static users = `
    ${this.CTINE}
    users (
        id              VARCHAR(20) PRIMARY KEY NOT NULL, 
        updated_at      VARCHAR(24), 
        created_at      VARCHAR(24), 
        identity        VARCHAR(100), 
        keygen          VARCHAR(15)
    );`

    static verification  = `
    ${this.CTINE}
    verification (
        identity VARCHAR(100), 
        otp VARCHAR(6),  
        created_at VARCHAR(24), 
        expires_in INT(6), 
        type VARCHAR(10)
    )`;

    static profile = `
    ${this.CTINE}
    profile (
        userId VARCHAR(20) PRIMARY KEY,
        name VARCHAR(20), 
        image_blob BLOB(16777215),
        FOREIGN KEY(userId) REFERENCES users(id)
    )
    `

    static social = `
    ${this.CTINE}
    social (
        fromId VARCHAR(20),
        toId VARCHAR(20),
        response VARCHAR(22),
        updatedAt VARCHAR(24),
        FOREIGN KEY(fromId) REFERENCES users(id) ON DELETE SET NULL
    )
    `
}

class Tables {
    static users = "users"
    static verification = "verification";
    static profile = "profile";
}

const TABLE_KEYS = {
    id : 'id',
    updatedAt : 'updated_at',
    createdAt : 'created_at',
    identity : 'identity',
    keygen : 'keygen',
    validityExpires : 'validity_expires',
    identity : 'identity',
    otp : 'otp',
    type : 'type'
}

exports.MYSQL_TABLES = [MYSQL_TABLE.users, MYSQL_TABLE.verification, MYSQL_TABLE.profile, MYSQL_TABLE.social]//, MYSQL_TABLE.social, MYSQL_TABLE.requests];
exports.TABLE_KEYS = TABLE_KEYS;
exports.TABLES = Tables;