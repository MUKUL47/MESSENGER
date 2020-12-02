var db = require("../config").Database;
const promiseMysql = require("promise-mysql");
var tables = require("./tables");
const rxjs = require("rxjs");
const utils = require("../../Server/utils");
var globalConnectionReady = new rxjs.Subject();
var globalConnection;
(function firstTime() {
  globalConnectionReady.complete();
})();

exports.initMysql = async (_) => {
  globalConnection = await promiseMysql.createConnection({
    host: db.host,
    user: db.user,
    database: db.db,
    password: process.env.DB_PASS,
  });
  console.log(tables.MYSQL_TABLES)
  rxjs
    .combineLatest(
      tables.MYSQL_TABLES.map((table) => globalConnection.query(table))
    )
    .subscribe(resp => {
      console.log('created', resp)
    }, err => {
      console.log('er mysql', err)
    });
};

exports.execute = (query) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(query)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.updateOtpVerification = (identity, otp, createdAt, expireIn, type) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(
        `INSERT INTO verification(identity, otp, created_at, expires_in, type)  VALUES('${identity}', ${otp}, '${createdAt}', ${expireIn}, '${type}')`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.initUser = (
  id,
  updated_at,
  created_at,
  identity,
  validityExpires,
  keygen
) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(
        `INSERT INTO users(id, updated_at, created_at, identity, validity_expires, keygen)  VALUES( '${id}', '${updated_at}', '${created_at}', "${identity}", '${validityExpires}', '${keygen}')`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.updateVerification = (type, identity, otp, createdAt, expireIn) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(
        `UPDATE verification SET otp = ${otp}, created_at = '${createdAt}', expires_in = '${expireIn}' WHERE ${type} = '${identity}'`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalFetch = (tableName, columnName, target) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(`SELECT * FROM ${tableName} WHERE ${columnName} = "${target}"`)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalFetchReferences = (tableName, references) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(`SELECT * FROM ${tableName} WHERE ${references}"`)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalUpdateSingle = (
  tableName,
  key,
  target,
  whereKey,
  whereTarget
) => {
  return new Promise((resolve, reject) => {
    const q = `UPDATE ${tableName} SET ${key} = '${target}' WHERE ${whereKey} = '${whereTarget}'`;
    console.log(q);
    globalConnection
      .query(q)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalUpdate = (tableName, whereKey, whereTarget, references) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(
        `UPDATE ${tableName} SET ${references} WHERE ${whereKey} = '${whereTarget}'`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalDelete = (tableName, key, target) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(`DELETE FROM ${tableName} WHERE ${key} = "${target}"`)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.globalSearchLike = (tableName, key, target, pattern, selectQuery) => {
  return new Promise((resolve, reject) => {
    let query = "";
    switch (pattern) {
      case "anyPos":
        query = "%" + target + "%";
        break;
    }
    globalConnection
      .query(
        `SELECT ${selectQuery ? selectQuery : "*"
        } FROM ${tableName} WHERE ${key} LIKE "${query}"`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.initRequest = (id, from_id, created_at) => {
  return new Promise((resolve, reject) => {
    globalConnection
      .query(
        `INSERT INTO requests(id, from_id, created_at)  VALUES('${id}', '${from_id}', '${created_at}')`
      )
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.initOrUpdateUser = (user, exist) => {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO users (id, updated_at, created_at, identity, keygen)
        values ('${user.id}' ,'${user.updated_at}' ,'${user.created_at}', '${user.identity
      }', '${user.keygen}' )
        ON DUPLICATE KEY UPDATE 
        id          = '${user.id}',
        updated_at  = '${user.updated_at}',
        keygen      = '${user.keygen}'
        ${exist ? `,created_at      = '${utils.CURRENT_DATE}'` : ""}
        `;
    globalConnection
      .query(query)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.getProfileById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT users.id, users.identity, users.created_at, profile.image_blob, profile.name
        FROM users INNER JOIN profile ON users.id = profile.userId AND profile.userId = '${id}'      
        `;
    globalConnection
      .query(query)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.getUsers = (currentUserId, displayString, t, s) => {
  return new Promise((resolve, reject) => {
    const globalUserQ = `
        SELECT 
            users.id, 
            users.identity, 
            users.created_at as createdAt, 
            profile.image_blob as image, 
            profile.name
        FROM users 
        INNER JOIN
            profile ON users.id = profile.userId AND 
            profile.userId <> '${currentUserId}' AND
            profile.name LIKE '%${displayString}%'
        `;
    console.log(globalUserQ);
    const total = globalConnection.query(
      `select count(*) as count FROM (${globalUserQ}) c`
    );
    const sortedUsersQ = globalConnection.query(
      `${globalUserQ} ORDER BY profile.name DESC LIMIT ${t} OFFSET ${s}`
    );
    Promise.all([total, sortedUsersQ])
      .then((r) => resolve(r))
      .catch((e) => reject(e));
  });
};

exports.sendFriendRequest = (userId, toId) => {
  return new Promise(async (R, r) => {
    try {
      const checkIfValidOp = `
            SELECT COUNT(*) FROM social
            WHERE
                fromId  = '${userId}' AND toId = '${toId}' 
            OR  toId    = '${userId}'  AND fromId = '${toId}' 
            `;
      const count = await globalConnection.query(checkIfValidOp);
      console.log("-q", checkIfValidOp);
      console.log("-count", count);
      if (count[0] && count[0]["COUNT(*)"] > 0) {
        R({ affectedRows: 0 });
        return;
      }
      const q = `
            INSERT INTO social VALUES('${userId}', '${toId}', 'P@${userId}', '${utils.CURRENT_DATE}')
            `;
      R(await globalConnection.query(q));
    } catch (ee) {
      console.log("eee", ee);
      r(ee);
    }
  });
};

exports.getStatus = (userId, toId) => {
  return new Promise((Rs, re) => {
    const q = `SELECT * from social WHERE fromId = '${userId}' AND toId = '${toId}' OR fromId = '${toId}' AND toId = '${userId}'`;
    globalConnection
      .query(q)
      .then((rr) => Rs(rr))
      .catch((e) => re(e));
  });
};

exports.revokeRequest = (userId, toId) => {
  return new Promise((Rs, re) => {
    const q = `DELETE FROM social WHERE response = 'P@${userId}' AND toId = '${toId}' AND fromId = '${userId}'`;
    globalConnection
      .query(q)
      .then((rr) => Rs(rr))
      .catch((e) => re(e));
  });
};
exports.respondRequest = (userId, toId, answer) => {
  return new Promise((Rs, re) => {
    const q =
      answer == 0
        ? `DELETE FROM social WHERE toId = '${userId}' AND fromId = '${toId}' AND  response = 'P@${toId}'`
        : `UPDATE social SET response = 'A@${toId}' WHERE toId = '${userId}' AND fromId = '${toId}' AND  response = 'P@${toId}'`;
    globalConnection
      .query(q)
      .then((rr) => Rs(rr))
      .catch((e) => re(e));
  });
};

exports.deleteFriend = (userId, toId) => {
  return new Promise((Rs, re) => {
    const q = `DELETE FROM social WHERE 
        toId = '${userId}' AND fromId = '${toId}' OR
        fromId = '${userId}' AND toId = '${toId}' AND  
        response LIKE 'A%'`; //A = approved = friend
    globalConnection
      .query(q)
      .then((rr) => Rs(rr))
      .catch((e) => re(e));
  });
};

exports.getMyNetwork = (userId, type, start, count) => {
  //P A(friends)
  return new Promise((Rs, re) => {
    //P@ => P@myId (request sent from myside) p@{!myId} | toId == myId(incomingreqs) | fromId == 'myId or toId = myId AND response = A
    const globalUserQ = (condition) => `
      SELECT social.response, users.identity, profile.* from social
        INNER JOIN users ON
        ${condition}
        JOIN profile ON
          profile.userId = '${userId}' OR  social.toId = '${userId}'
    `;
    let q;
    if (type === "A") {
      q = `SELECT social.response, users.identity, profile.* from social
            INNER JOIN users ON 
              social.response LIKE 'A%' AND 

              social.toId = '${userId}' AND 
              users.id = social.fromId 
              OR
              social.fromId = '${userId}' AND 
              users.id = social.toId 

            INNER JOIN profile ON
              profile.userId = social.fromId OR profile.userId = social.toId`;

    } else if (type === "P@") {
      q = `SELECT social.response, users.identity, profile.* from social
            INNER JOIN users ON
              response = 'P@${userId}' AND users.id = social.toId INNER JOIN profile on profile.userId = social.toId`;
    } else {
      q = `SELECT social.response, users.identity, profile.* from social
            INNER JOIN users ON 
              social.response LIKE 'P%' AND 
              social.toId = '${userId}' AND 
              users.id = social.fromId 
            INNER JOIN profile ON
              profile.userId = social.fromId`;
    }
    console.log(q);
    const total = globalConnection.query(
      `select count(*) as count FROM (${q}) c`
    );
    const sortedUsersQ = globalConnection.query(
      `${q} ORDER BY profile.name DESC LIMIT ${count} OFFSET ${start}`
    );
    Promise.all([total, sortedUsersQ])
      .then((r) => Rs(r))
      .catch((e) => re(e));
  });
};

exports.removeFriendRequest = (userId, toUserId) => {
  return new Promise((R, r) => {
    const q = `
        DELETE FROM social WHERE 
            fromId = '${userId}' AND toUserId = '${toUserId} 
        OR  toUserId = '${userId}' AND fromId = '${toUserId}'
        `;
    globalConnection
      .query(q)
      .then((rr) => R(rr))
      .catch((e) => r(e));
  });
};

exports.logout = (secret) => {
  return new Promise((resolve, reject) => { });
};

exports.updateProfile = (id, name, imageBlob) => {
  return new Promise(async (resolve, reject) => {
    const checkSameName = `SELECT COUNT(name) FROM profile WHERE name = '${name}'`;
    const count = await globalConnection.query(checkSameName);
    // if (count[0] && count[0]["COUNT(name)"] > 0) {
    //   reject(1);
    //   return;
    // }
    const query = `
        INSERT INTO profile (userId, name, image_blob)
        values ('${id}' ,'${name}' ,'${imageBlob}')
        ON DUPLICATE KEY UPDATE 
        userId          = '${id}',
        name        = '${name}',
        image_blob  = '${imageBlob}'
        `;
    globalConnection
      .query(query)
      .then((rows) => resolve(rows))
      .catch((err) => reject(err));
  });
};

exports.customExecute = (query) => {
  return new Promise((R, r) =>
    globalConnection
      .query(query)
      .then((r) => R(r))
      .catch((e) => r(e))
  );
};

// export class Common {
//     static globalFetch = query => new Promise((resolve, reject) => {
//         globalConnection.query(query)
//         .then( rows => resolve(rows))
//         .catch( err => reject(err));
//     })

// }

// export class Social {
//     static initRequest = object => `INSERT INTO requests(id, from_id, created_at)  VALUES('${object.id}', '${object.from_id}', '${object.created_at}')`
// }
