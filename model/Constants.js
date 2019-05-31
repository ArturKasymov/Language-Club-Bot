const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com/v2.6/';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const request = require('request');

// postbacks
const GET_STARTED = 'GET_STARTED';
const START_REGISTRATION_YES = 'START_REGISTRATION_YES';
const CONTACT_US = 'CONTACT_US';
const CANCEL = 'CANCEL';

// statuses
const got_started = "got_started";

// POSTGRESQL QUERIES
const INSERT_USER = 'INSERT INTO users VALUES($1, ' + got_started + ', NULL, NULL)';

module.exports = {
    request: request,
    FACEBOOK_GRAPH_API_BASE_URL: FACEBOOK_GRAPH_API_BASE_URL,
    PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
    GET_STARTED: GET_STARTED,
    GREETING: GREETING,
    START_REGISTRATION_YES: START_REGISTRATION_YES,
    START_REGISTRATION_NO: START_REGISTRATION_NO,
    CANCEL: CANCEL,
}