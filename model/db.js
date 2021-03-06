const pg = require('pg');
const format = require('pg-format');
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
/*pool.query('DELETE FROM languages WHERE 1=1')
    .then((err, res) => {
        console.log(err, res);
        pool.query('DELETE FROM users WHERE 1=1')
        .then((err, res) => console.log(err, res))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));*/
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
        case CONSTANTS.INSERT_USER_LANGUAGES:
            insertUserLanguages(args);
            break;
        case CONSTANTS.GET_PERMISSION_LEVEL:
            return getPermLvl(args);
        case CONSTANTS.UPDATE_PERMISSION_LEVEL:
            updatePermLvl(args);
            break;
        case CONSTANTS.GET_USER_LANGUAGES:
            return getUserLanguages(args);
        case CONSTANTS.DELETE_USER_LANGUAGES:
            return deleteUserLanguages(args);
        case CONSTANTS.GET_USERS_LIST_DATA:
            return getUsersListData();
        case CONSTANTS.GET_ALL_PLACES:
            return getPlacesListData();
        case CONSTANTS.INSERT_PLACE:
            return insertPlace(args);
        case CONSTANTS.INSERT_MEETING:
            insertMeeting(args);
            break;
        case CONSTANTS.GET_MEETINGS_LIST:
            return getMeetingsList(args);
        case CONSTANTS.UPDATE_MEETING:
            updateMeeting(args);
            break;
        case CONSTANTS.GET_CURRENT_MEETING:
            return getCurrentMeeting(args);
        case CONSTANTS.GET_USERS_ON_MEETING:
            return getUsersOnMeeting(args);
        case CONSTANTS.UPDATE_VISITOR:
            updateVisitor(args);
            break;
        case CONSTANTS.START_MEETING:
            startMeeting(args);
            break;
        case CONSTANTS.FINISH_MEETING:
            finishMeeting(args);
            break;
        case CONSTANTS.GET_FUTURE_MEETINGS:
            return getFutureMeetings(args);
        case CONSTANTS.INSERT_VISITOR:
            insertVisitor(args);
            break;
        case CONSTANTS.DELETE_VISITOR:
            deleteVisitor(args);
            break;
        case CONSTANTS.GET_HISTORY_MEETINGS:
            return getHistoryMeetings(args);
        case CONSTANTS.GET_USER_PARTNERS:
            return getUserPartners(args);
        
        //TEMP CASES
        case 'ADMIN':
            updatePermLvl(['3', args[0]]);
            break;
        case 'USER':
            updatePermLvl(['1', args[0]]);
            break;
        
        
        default:
            break;
    }
};

function insertUser(args) {
    checkIfUserExists(args[0])
    .then((exists) => {
        if (!exists) {
            pool.query(CONSTANTS.INSERT_USER_QUERY, args, (err, result) => {
                if (err) {
                    return console.error('Error INSERT_USER query', err.stack);
                }
            })
        }
    });
}

function insertMeeting(args) {
    console.log(args[0]);
    pool.query(CONSTANTS.INSERT_MEETING_QUERY, args, (err, res) => {
        console.log(err, res);
    });
}

function insertVisitor(args) {
    pool.query(CONSTANTS.INSERT_VISITOR_QUERY, args, (err, res) => {
        console.log(err, res);
    });
}

function deleteVisitor(args) {
    pool.query(CONSTANTS.DELETE_VISITOR_QUERY, args, (err, res) => {
        console.log(err, res);
    });
}

function updateMeeting(args) {
    console.log(args.toString());
    pool.query(CONSTANTS.UPDATE_MEETING_QUERY, args, (err, res) => {
        console.log(err, res);
    });
}

function startMeeting(args) {
    pool.query(CONSTANTS.START_MEETING_QUERY1, args);
    pool.query(CONSTANTS.START_MEETING_QUERY2, args);
}

function finishMeeting(args) {
    pool.query(CONSTANTS.FINISH_MEETING_QUERY1, args);
    pool.query(CONSTANTS.FINISH_MEETING_QUERY2, args);
}

function updateStatus(args) {
    if (args[0] == CONSTANTS.CONTACTING_US) {
        getStatus([args[1]])
        .then((status) => {
            args[0] += ":" + status;
            console.log("NEW STATUS: " + args[0]);
        })
        .then(() => {
            console.log("NEW STATUS: " + args[0]);
            if (args[0]) pool.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
                console.log("SETTING STATUS TO: " + args[0]);
                if (err) {
                    return console.error('Error UPDATE_STATUS query', err.stack);
                }
            });
        });
    } else {
        if (args[0]) pool.query(CONSTANTS.UPDATE_CYCLE_STATUS, args, (err, result) => {
            console.log("SETTING STATUS TO: " + args[0]);
            if (err) {
                return console.error('Error UPDATE_STATUS query', err.stack);
            }
        });
    };
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

function getCurrentMeeting(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_CURRENT_MEETING_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("current_meeting id: " + result.rows[0].id);
        return result.rows[0];
    });
};

function getUsersOnMeeting(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_USERS_ON_MEETING_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("users count: " + result.rows.length);
        return result.rows;
    });
};

function getUserPartners(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_USER_PARTNERS_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("partners count: " + result.rows.length);
        return result.rows;
    });
};

function getFutureMeetings(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_FUTURE_MEETINGS_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("meetings count: " + result.rows.length);
        return result.rows;
    });
}

function getHistoryMeetings(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_HISTORY_MEETINGS_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("meetings count: " + result.rows.length);
        return result.rows;
    });
}

function getPermLvl(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_PERMISSION_LEVEL_QUERY, args));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("permLvl: " + result.rows[0]);
        return result.rows[0].permissionLevel;
    });  
}

function getAllLanguages() {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_ALL_LANGUAGES_QUERY));
    })
    .then((result) => {
        if (result == undefined || result.rows.length == 0) {
            return undefined;
        }
        console.log("array: " + result.rows[0].getlanguagesarray);
        return result.rows[0].getlanguagesarray;
    });
}

function insertPlace(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.INSERT_PLACE_QUERY, args));
    }).then((result) => {
        const row = result.rows[0];
        return { id: row.id, label: row.name + ' (' + row.adress + ', ' + row.city + ')' };
    }).catch((err) => console.log(err));
}

function deleteUserLanguages(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.DELETE_ALL_USER_LANGUAGES, args));
    }).then((result) => {
        console.log("DELETED USER LANGUAGES");
    });
}

function updateVisitor(args) {
    pool.query(CONSTANTS.UPDATE_VISITOR_QUERY, args);
}

function getUserLanguages(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_USER_LANGUAGES_QUERY, args));
    })
    .then((result) => {
        if (result === undefined || result.rows.length === 0) {
            return undefined;
        }
        const obj = { user_langs: result.rows.map((entry, index) => entry["langName"]) };
        console.log("USER_LANGS: " + JSON.stringify(obj));
        return obj;
    }).catch((err) => console.log(err));
}

function getMeetingsList(args) {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_MEETINGS_LIST_QUERY, args));
    })
    .then((result) => {
        if (result === undefined || result.rows.length === 0) {
            return undefined;
        }
        var obj = {};
        for (var i = 0; i < result.rows.length; i++) {
            const row = result.rows[i];
            console.log("ROW: " + JSON.stringify(row));
            obj[row.id] = [row["placeID"], row["place_name"], row["place_city"], row["place_address"], row["organizerID"], row["organizer_nickname"],
                row["description"], row["startDate"], row["endDate"]];
        }
        console.log("USER_LANGS: " + JSON.stringify(obj));
        return obj;
    }).catch((err) => console.log(err));
}

function getUsersListData() {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_ALL_USERS_QUERY));
    })
    .then((result) => {
        var obj = {};
        for (var i = 0; i < result.rows.length; i++) {
            if (result.rows[i]["permissionLevel"] !== "0")
                obj[result.rows[i]["facebookID"]] = result.rows[i]["permissionLevel"] + result.rows[i].nickname;
        }
        console.log("SENDING " + JSON.stringify(obj));
        return obj;
    });
};

function getPlacesListData() {
    return new Promise((resolve, reject) => {
        resolve(pool.query(CONSTANTS.GET_ALL_PLACES_QUERY));
    })
    .then((result) => {
        var obj = {};
        for (var i = 0; i < result.rows.length; i++) {
            obj[result.rows[i].id] = result.rows[i].name + ' (' + result.rows[i].adress + ', ' + result.rows[i].city + ')';
        }
        console.log("SENDING " + JSON.stringify(obj));
        return obj;
    });
};


function updateNickname(args) {
    pool.query(CONSTANTS.UPDATE_NICKNAME_QUERY, args, (err, result) => {
        getStatus([args[1]])
        .then((status) => updateStatus([nextStatus(status), args[1]]));
        if (err) {
            return console.error('Error UPDATE_NICKNAME query', err.stack);
        }
    });
}

function insertUserLanguages(args) {
    pool.query(CONSTANTS.DELETE_ALL_USER_LANGUAGES, [args[0]])
    .then((result) => {
        console.log("DELETED_ALL_USER_LANGS... " + JSON.stringify(result));
        const langs = args[1].map((entry, index) =>[args[0], entry]);
        pool.query(format(CONSTANTS.INSERT_USER_LANGUAGES_QUERY, langs)).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
}

function updatePermLvl(args) {
    pool.query(CONSTANTS.UPDATE_PERMISSION_LEVEL_QUERY, args, (err, result) => {
        if (err) return console.error('Error UPDATE_PERMISSION_LEVEL query', err.stack);
    });
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