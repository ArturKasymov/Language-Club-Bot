import express from 'express';

import sendApi from '../api/send';
import receiveApi from '../api/receive';

const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.get('/:userID', ({params: {userID}}, res) => {
    console.log("IN GET /USERS/:id");
    query(CONSTANTS.GET_ALL_LANGUAGES, [])
    .then((array) => {
        const langsJSON = JSON.stringify(array);

        console.log(`GET User response: ${langsJSON}`);

        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});

/*router.put('/:userID', ({body, params: {userID}}, res) => {
    query(CONSTANTS.INSERT_USER_LANGUAGES, [userID, JSON.parse(body)]);
});*/


export default router;