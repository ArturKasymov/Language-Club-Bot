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
            break;
        case CONSTANTS.BACK:
            return goBack(args);
        case CONSTANTS.GET_ALL_LANGUAGES:
            return getAllLanguages();
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
            if (args[0] == CONSTANTS.CONTACTING_US) {
                getStatus([args[1]])
                .then((status) => {
                    args[0] += ":" + status;
                    console.log("NEW STATUS: " + args[0]);
                })
                .then(() => {
                    console.log("NEW STATUS: " + args[0]);
                    client.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
                        console.log("SETTING STATUS TO: " + args[0]);
                        release();
                        if (err) {
                            return console.error('Error UPDATE_STATUS query', err.stack);
                        }
                    })
                });
            } else {
                client.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
                    console.log("SETTING STATUS TO: " + args[0]);
                    release();
                    if (err) {
                        return console.error('Error UPDATE_STATUS query', err.stack);
                    }
                })
            }
                
        }
    })
}

function checkIfUserExists(id) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_USER_DATA, [id]));
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
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("innerStatus: " + result.rows[0].status);
        return result.rows[0].status;
    });
};

function getAllLanguages() {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_ALL_LANGUAGES_QUERY));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
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
                getStatus([args[1]])
                .then((status) => updateStatus([nextStatus(status), args[1]]));
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
        console.log("GOING BACK FROM " + status);
        var prevSt = prevStatus(status, id);
        console.log("TO " + prevSt);
        updateStatus([prevSt, id]);
        return prevSt;
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

function prevStatus(status, id) {
    switch (status) {
        case CONSTANTS.GOT_NICKNAME:
            return CONSTANTS.STARTED_REGISTRATION;
        case CONSTANTS.STARTED_REGISTRATION:
            return CONSTANTS.GOT_STARTED;
        default:
            if (status.indexOf(CONSTANTS.CONTACTING_US) == 0) return status.split(':')[1];
            return undefined;
    }
}

module.exports = query;