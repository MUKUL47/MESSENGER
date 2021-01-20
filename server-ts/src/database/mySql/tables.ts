class MYSQL_TABLE {
    static CTINE = 'CREATE TABLE IF NOT EXISTS '
    static users = `
    ${MYSQL_TABLE.CTINE}
    users (
        id              VARCHAR(20) PRIMARY KEY NOT NULL, 
        updated_at      VARCHAR(24), 
        created_at      VARCHAR(24), 
        identity        VARCHAR(100), 
        keygen          VARCHAR(15)
    );`

    static verification  = `
    ${MYSQL_TABLE.CTINE}
    verification (
        identity VARCHAR(100), 
        otp VARCHAR(6),  
        created_at VARCHAR(24), 
        expires_in INT(6), 
        type VARCHAR(10)
    )`;

    static profile = `
    ${MYSQL_TABLE.CTINE}
    profile (
        userId VARCHAR(20) PRIMARY KEY,
        name VARCHAR(20), 
        image_blob BLOB(16777215),
        FOREIGN KEY(userId) REFERENCES users(id)
    )
    `

    static social = `
    ${MYSQL_TABLE.CTINE}
    social (
        fromId VARCHAR(20),
        toId VARCHAR(20),
        response VARCHAR(22),
        updatedAt VARCHAR(24),
        FOREIGN KEY(fromId) REFERENCES users(id) ON DELETE SET NULL
    )
    `

    static db = `CREATE DATABASE IF NOT EXISTS messenger`
    static useDb = `USE messenger`
}
export default [MYSQL_TABLE.db, MYSQL_TABLE.useDb, MYSQL_TABLE.users, MYSQL_TABLE.verification, MYSQL_TABLE.profile, MYSQL_TABLE.social]