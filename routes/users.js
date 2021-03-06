import express from 'express';

import sendApi from '../api/send';
import receiveApi from '../api/receive';

const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const router = express.Router();

router.get('/:userID/all_languages', ({params: {userID}}, res) => {
    console.log("IN GET /USERS/" + userID);
    query(CONSTANTS.GET_ALL_LANGUAGES, [])
    .then((array) => {
        const langsJSON = JSON.stringify(array);

        console.log(`GET User response: ${langsJSON}`);

        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});


router.get('/:userID/check_perm/:required', (req, res) => {
    console.log("CHECK PERMISSION " + req.params.userID);

    query(CONSTANTS.GET_PERMISSION_LEVEL, [req.params.userID])
    .then((result) => {

        const resultJSON = JSON.stringify(result);
        res.setHeader('Content-Type', 'application/json');

        res.send(resultJSON);

        switch(req.params.required){
            case '0':
                if(result!="0")sendApi.sendAlreadyRegistrMessage(req.params.userID);
                break;
            case '1':
                if(result=="0")sendApi.sendNeedRegistrationMessage(req.params.userID);
                break;
            case '2':
                if(!(result=="2"||result=="3"))sendApi.sendPermissionMessage(req.params.userID);
                break;
            case '3':
                if(result!="3")sendApi.sendPermissionMessage(req.params.userID);
                break;
        }
    }).catch((err) => console.log(err));
});

router.get('/:userID/user_languages', ({params: {userID}}, res) => {
    console.log("IN GET /USERS/" + userID);
    query(CONSTANTS.GET_USER_LANGUAGES, [userID])
    .then((obj) => {
        const langsJSON = JSON.stringify(obj);

        console.log(`GET User response: ${langsJSON}`);

        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});

router.get('/:userID/users_list', ({params: {userID}}, res) => {
    console.log("IN GET /USERS/" + userID);
    query(CONSTANTS.GET_USERS_LIST_DATA, [])
    .then((result) => {
        const langsJSON = JSON.stringify(result);
        console.log("ALL USERS: " + langsJSON);
        res.setHeader('Content-Type', 'application/json');
        res.send(langsJSON);
    }).catch((err) => console.log(err));
});

router.put('/:userID/remove', ({body, params: {userID}}, res) => {
    console.log("RECEIVED OBJECT: " + body.orgID);
    query(CONSTANTS.UPDATE_PERMISSION_LEVEL, ['1', body.orgID]);
    res.sendStatus(204);
});

router.put('/:userID', ({body, params: {userID}}, res) => {
    if (body.nickname) query(CONSTANTS.UPDATE_NICKNAME, [body.nickname, userID]);
    console.log('INSERTING_USER_LANGS... ' + body.languages);
    query(CONSTANTS.INSERT_USER_LANGUAGES, [userID, body.languages]);

    res.sendStatus(204);

    query(CONSTANTS.UPDATE_PERMISSION_LEVEL, ['1', userID]);
    sendApi.sendRegistrationOKMessage(userID, body.nickname);

    //TEMP SEND
    sendApi.tempSend(userID, {
        "attachment": {
            "type": "template",
            "payload": {
            "template_type": "button",
            "text": "Szanowny Panie Macieju,\nżeby Panu było wygodniej testować, zrobiliśmy możliwość zmiany permissionLvla dla Pana. Przy admin modę naciskając przycisk \"Contact us\" otrzyma Pan admin panel.",
            "buttons": [{
                "type": "postback",
                "title": "Admin mode",
                "payload": 'ADMIN'
            },
            {
                "type": "postback",
                "title": "User mode",
                "payload": 'USER'
            }]}
        }
    });

    sendApi.tempSend("2066560726803687", {"text": "testing"} );
});

router.put('/:userID/nickname', ({body, params: {userID}}, res) => {
    query(CONSTANTS.UPDATE_NICKNAME, [body.nickname, userID]);

    res.sendStatus(204);

    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.IN_MENU, userID]);
    sendApi.sendNickNameChangedMessage(userID, body.nickname);
});


export default router;