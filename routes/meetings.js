import express from 'express';

import sendApi from '../api/send';
import receiveApi from '../api/receive';

const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.get('/:userID', ({params: {userID}}, res) => {
    console.log("IN GET /MEETINGS/" + userID);
    query(CONSTANTS.GET_ALL_PLACES, [])
    .then((obj) => {
        const langsJSON = JSON.stringify(obj);

        console.log(`GET User response: ${langsJSON}`);

        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});

router.put('/:userID', ({body, params: {userID}}, res) => {
    console.log("IN PUT /MEETINGS/" + userID);
    query(CONSTANTS.INSERT_MEETING, [body.place_id, userID, body.description, body.startTime, body.endTime])
    res.sendStatus(204);
});

export default router;