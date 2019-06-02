import castArray from 'lodash/castArray';

import api from './api';
import messages from './messages';

function sendMessage(id, payloads) {
    const payloadsArray = caseArray(payloads).map((payload) => messageToJSON(id, payload));
    api.callMessagesApi([
        typingOn(id),
        ...payloadsArray,
        typingOff(id)
    ], {});
}

function messageToJSON(psid, payload) {
    return {
        recipient: {
            id: psid,
        },
        message: payload
    };
};

const typingOn = (id) => {
    return {
        recipient: {
            id: recipientId,
        },
        sender_action: 'typing_on', // eslint-disable-line camelcase
    };
}

const typingOff = (id) => {
    return {
        recipient: {
            id: recipientId,
        },
        sender_action: 'typing_off', // eslint-disable-line camelcase
    };
}

function sendGreetingMessage(id) {
    sendMessage(id, messages.greetingMessage);
}

export default {
    sendMessage,
    sendGreetingMessage
};