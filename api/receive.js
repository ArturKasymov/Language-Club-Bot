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
        case CONSTANTS.REGISTRATION:
            handleNeedRegistration(sender_psid);
            break;
        case CONSTANTS.CONTACT_US:
            handleContactUs(sender_psid);
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

    /*query(CONSTANTS.GET_STATUS, [sender_psid])
    .then((status) => {
        console.log("STATUS: " + status);
        switch (status) {
            case CONSTANTS.CONTACTING_US:
                // forward messages
                break;
            default:
                console.log("handleMessage default");
                break;
        }
    });*/
}


function handleGetStartedPostback(sender_psid) {
    query(CONSTANTS.INSERT_USER, [sender_psid, CONSTANTS.GOT_STARTED]);
    sendApi.sendGreetingMessage(sender_psid);
}

function handleNeedRegistration(sender_psid){
    sendApi.sendNeedRegistrationMessage(sender_psid);
}

function handleContactUs(sender_psid) {
    query(CONSTANTS.GET_PERMISSION_LEVEL, [sender_psid])
    .then( (permissionLevel) => {
        switch(permissionLevel) {
            case '3':
                sendApi.sendAdminPanelMessage(sender_psid);
            break;
            case '2':
                sendApi.sendOrganizatorPanelMessage(sender_psid);
                break;
            case '0':
            case '1':
                query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.CONTACTING_US, sender_psid]);
                sendApi.sendContactingUsMessage(sender_psid);
                break;
        }
    }); 
}

export default {
  handleReceivePostback,
  handleReceiveMessage,
  handleReceiveReferral
};