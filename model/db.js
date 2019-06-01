const pg = require('pg');
const CONSTANTS = require('./Constants.js');

var config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

// ONLY FOR TESTING
pool.query('DELETE FROM users WHERE 1=1')
    .then((err, res) => console.log(err, res))
    .catch(err => console.log(err));
// END

function query(type, args) {
    switch (type) {
        case CONSTANTS.GET_STATUS:
            return getStatus(args);
        case CONSTANTS.INSERT_USER:
            insertUser(args);
            break;
        case CONSTANTS.UPDATE_STATUS:
            updateStatus(args);
            break;
        case CONSTANTS.UPDATE_NICKNAME:
            updateNickname(args);
        case CONSTANTS.BACK:
            return goBack(args);
        default:
            break;
    }
};

function insertUser(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        } else {
            checkIfUserExists(args[0])
            .then((exists) => {
                if (!exists) {
                    client.query(CONSTANTS.INSERT_USER_QUERY, args, (err, result) => {
                        release();
                        if (err) {
                            return console.error('Error INSERT_USER query', err.stack);
                        }
                    })
                }
            });
        }
    })
}

function updateStatus(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        } else {
            client.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
                release();
                if (err) {
                    return console.error('Error UPDATE_STATUS query', err.stack);
                }
            })
        }
    })
}

function checkIfUserExists(id) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_USER_DATA, [args]));
    })
    .then((result) => {
        if (result == undefined) {
            console.log("UNDEFINED STATUS");
        }
        return result == undefined || result.rows.length > 0;
    });
}

function getStatus(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_STATUS_QUERY, args));
    })
    .then((result) => {
        if (result == undefined) {
            console.log("UNDEFINED STATUS");
            return undefined;
        }
        console.log("innerStatus: " + result.rows[0].status);
        return result.rows[0].status;
    });
};

function updateNickname(args) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.log('Error acquiring client', err.stack);
        } else {
            client.query(CONSTANTS.UPDATE_NICKNAME_QUERY, args, (err, result) => {
                updateStatus(nextStatus(args[0]));
                release();
                if (err) {
                    return console.error('Error UPDATE_NICKNAME query', err.stack);
                }
            })
        }
    })
}

function goBack(id) {
    return getStatus([id])
    .then((status) => {
        const prevSt = prevStatus(status);
        updateStatus([prevSt, id]);
        return nextSt;
    });
}

function nextStatus(status) {
    switch (status) {
        case CONSTANTS.STARTED_REGISTRATION:
            return CONSTANTS.GOT_NICKNAME;
        default:
            return undefined;
    }
}

function prevStatus(status) {
    switch (status) {
        case CONSTANTS.GOT_NICKNAME:
            return CONSTANTS.REGISTRATION_STARTED;
        case CONSTANTS.REGISTRATION_STARTED:
            return CONSTANTS.GOT_STARTED;
        default:
            return undefined;
    }
}

module.exports = query;