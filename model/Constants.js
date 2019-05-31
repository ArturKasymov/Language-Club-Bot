const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com/v2.6/';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const request = require('request');

// postbacks
const GET_STARTED = 'GET_STARTED';
const START_REGISTRATION_YES = 'START_REGISTRATION_YES';
const CONTACT_US = 'CONTACT_US';
const MENU = "MENU";
const BACK = 'BACK';

// db_requests
const INSERT_USER = "INSERT_USER";
const STARTED_REGISTRATION = "STARTED_REGISTRATION";
const GET_STATUS = "GET_STATUS";
const UPDATE_STATUS = "UPDATE_STATUS";

// statuses
const GOT_STARTED = "GOT_STARTED";
//const STARTED_REGISTRATION = "STARTED_REGISTRATION";
const GOT_NICKNAME = "GOT_NICKNAME";

// POSTGRESQL QUERIES
const GET_USER_DATA = 'SELECT * FROM users WHERE "facebookID"=$1::varchar';
const INSERT_USER_QUERY = 'INSERT INTO users("facebookID", status, nickname, "permissionLevel") VALUES($1::varchar, $2::varchar, NULL, NULL)';
const UPDATE_CYCLE_STATUS = 'UPDATE users SET status=$1::varchar WHERE "facebookID"=$2::varchar';
const GET_STATUS_QUERY = 'SELECT status FROM users WHERE "facebookID"=$1::varchar';
const UPDATE_NICKNAME_QUERY = 'UPDATE users SET nickname=$1::varchar WHERE "facebookID"=$2::varcahr';

module.exports = {
    request: request,
    FACEBOOK_GRAPH_API_BASE_URL: FACEBOOK_GRAPH_API_BASE_URL,
    PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,

    GET_STARTED: GET_STARTED,
    START_REGISTRATION_YES: START_REGISTRATION_YES,
    CONTACT_US: CONTACT_US,
    MENU: MENU,
    BACK: BACK,

    INSERT_USER: INSERT_USER,
    STARTED_REGISTRATION: STARTED_REGISTRATION,
    GET_STATUS: GET_STATUS,
    UPDATE_STATUS: UPDATE_STATUS,

    GOT_STARTED: GOT_STARTED,
    GOT_NICKNAME: GOT_NICKNAME,

    GET_USER_DATA: GET_USER_DATA,
    INSERT_USER_QUERY: INSERT_USER_QUERY,
    UPDATE_CYCLE_STATUS: UPDATE_CYCLE_STATUS,
    GET_STATUS_QUERY: GET_STATUS_QUERY,
    UPDATE_NICKNAME_QUERY: UPDATE_NICKNAME_QUERY,
}