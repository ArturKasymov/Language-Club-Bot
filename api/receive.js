import sendApi from './send';
const CONSTANTS = require('../model/Constants.js');
const query = require('../model/db.js');

const util = require('util');

function handleReceiveReferral(event) {
    const senderId = event.sender.id;
    var payload = {};
    if (event.referral.ref){
        payload["ref"] = event.referral.ref;
    }
    if (event.referral.ad_id){
        payload["ad_id"] = event.referral.ad_id;
    }
};

function handleReceivePostback(messaging_event) {
    const payload = messaging_event.postback.payload;
    const sender_psid = messaging_event.sender.id;

    switch (payload) {
        case CONSTANTS.GET_STARTED:
            handleGetStartedPostback(sender_psid);
            break;
        case CONSTANTS.START_REGISTRATION_YES:
            handleRegistrationStart(sender_psid);
            break;
        case CONSTANTS.CONTACT_US:
            handleContactUs(sender_psid);
            break;
        case CONSTANTS.BACK:
            handleBack(sender_psid);
            break;
        case CONSTANTS.MENU:
            //handleMenu(sender_psid);
            break;
        default:
            console.log('Cannot differentiate the payload type');
    }
}

function handleReceiveMessage(messaging_event) {
    const message = messaging_event.message;
    const sender_psid = messaging_event.sender.id;

    //TODO fix 
    //sendApi.sendReadReceipt(sender_psid);

    // check if it is a location message
    console.log('handleMessage message:', JSON.stringify(message));

    query(CONSTANTS.GET_STATUS, [sender_psid])
    .then((status) => {
        console.log("STATUS: " + status);
        switch (status) {
            case CONSTANTS.STARTED_REGISTRATION:
                if (message.text.indexOf(" ") != -1) sendAlert(sender_psid);
                else handleInputNickname(sender_psid, message.text);
                break;
            case CONSTANTS.CONTACTING_US:
                // forward messages
                break;
            default:
                console.log("handleMessage default");
                break;
        }
    });
}












function handleGetStartedPostback(sender_psid) {
    query(CONSTANTS.INSERT_USER, [sender_psid, CONSTANTS.GOT_STARTED]);
    sendApi.sendGreetingMessage(sender_psid);
}

function handleInputNickname(sender_psid, nickname) {
    query(CONSTANTS.UPDATE_NICKNAME, [nickname, sender_psid]);
    sendApi.sendLanguagesChoose(sender_psid);
}

function handleRegistrationStart(sender_psid) {
    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.STARTED_REGISTRATION, sender_psid]);
    sendApi.sendNicknameReqMessage(sender_psid);
}

function handleContactUs(sender_psid) {
    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.CONTACTING_US, sender_psid]);
    sendApi.sendContactingUsMessage(sender_psid);
}

function handleBack(sender_psid) {
    query(CONSTANTS.BACK, sender_psid)
    .then((status) => {
        switch (status) {
            case CONSTANTS.GOT_STARTED:
                sendApi.sendGreetingMessage(sender_psid);
                break;
            case CONSTANTS.STARTED_REGISTRATION:
                sendApi.sendNicknameReqMessage(sender_psid);
                break;
            case CONSTANTS.GOT_NICKNAME:
                break;
            default:
                break;
        }         
    });
}

export default {
  handleReceivePostback,
  handleReceiveMessage,
  handleReceiveReferral
};