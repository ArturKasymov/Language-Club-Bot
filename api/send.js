import castArray from 'lodash/castArray';

import api from './api';
import messages from './messages';

function sendMessage(id, payloads) {
    const payloadsArray = castArray(payloads).map((payload) => messageToJSON(id, payload));
    api.callMessagesApi([
        typingOn(id),
        ...payloadsArray,
        typingOff(id)
    ], {});
}

function sendReadReceipt(psid) {
    const messageData = {
        recipient: {
            id: psid
        },
        sender_action: 'mark_seen'
    };

    api.callMessagesApi(messageData);
}

function messageToJSON(psid, payload) {
    return {
        recipient: {
            id: psid,
        },
        message: payload
    };
};

const typingOn = (psid) => {
    return {
        recipient: {
            id: psid,
        },
        sender_action: 'typing_on', // eslint-disable-line camelcase
    };
}

const typingOff = (psid) => {
    return {
        recipient: {
            id: psid,
        },
        sender_action: 'typing_off', // eslint-disable-line camelcase
    };
}

function sendGreetingMessage(id) {
    sendMessage(id, messages.greetingMessage);
}

function sendNicknameReqMessage(id) {
    sendMessage(id, messages.nicknameReqMessage);
}

function sendLanguagesChoose(id) {
    console.log(process.env.SERVER_URL);
    sendMessage(id, messages.chooseLanguagesTemplate)
}

function sendContactingUsMessage(id) {
    sendMessage(id, messages.contactingUsMessage);
}

export default {
    sendMessage,
    sendReadReceipt,
    sendGreetingMessage,
    sendNicknameReqMessage,
    sendLanguagesChoose,
    sendContactingUsMessage
};