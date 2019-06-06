import express from 'express';

import sendApi from '../api/send';
import receiveApi from '../api/receive';

const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.put('/:userID', ({body, params: {userID}}, res) => {
    console.log('INSERTING_PLACE... ' + JSON.stringify(body));
    query(CONSTANTS.INSERT_PLACE, [body.name, body.city, body.address, body.description, body.photo])
    .then((obj) => {
        res.sendStatus(204);
        res.send(JSON.stringify(obj));
    });
});

export default router;