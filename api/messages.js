const CONSTANTS = require('../model/Constants.js');

const SERVER_URL = process.env.SERVER_URL;


//Buttons
const backButton = {
    "type": "postback",
    "title": "Back",
    "payload": CONSTANTS.BACK
};

const registrationButton = {
  "type":"web_url",
  "title": "Register",
  "url": `${SERVER_URL}/registration`,
  "webview_height_ratio":"full",
  "webview_share_button": "hide",
  "messenger_extensions": true
}

const createMeetingButton = {
  "type":"web_url",
  "title": "   Create meeting",
  "url": `${SERVER_URL}/createmeeting`,
  "webview_height_ratio":"full",
  "webview_share_button": "hide",
  "messenger_extensions": true
}

const addOrganizatorButton = {
  "type": "web_url",
  "title": "  Organizators",
  "url": `${SERVER_URL}/organizators`,
  "webview_height_ratio":"full",
  "webview_share_button": "hide",
  "messenger_extensions": true
}

const meetingsListButton = {
  "type": "web_url",
  "title": "  Meetings List",
  "url": `${SERVER_URL}/meetingsadmlist`,
  "webview_height_ratio":"full",
  "webview_share_button": "hide",
  "messenger_extensions": true
}

const administrateMeetingButton = {
  "type": "web_url",
  "title": "Administrate meeting",
  "url": `${SERVER_URL}/meetingsadm`,
  "webview_height_ratio":"full",
  "webview_share_button": "hide",
  "messenger_extensions": true
}

//Messages
const greetingMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Welcome to our Language Club! Register for joining",
            "buttons": [registrationButton]
        }
    }
};

const contactingUsMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Everything you will write here will be sent to admins.",
            "buttons": [backButton]
        }
    }
};

const registrationNeedMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Please, register for using bot functionality",
            "buttons": [registrationButton]
        }
    }
};

const organizatorPanelMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "ORGANIZATOR PANEL",
            "buttons": [createMeetingButton, meetingsListButton, administrateMeetingButton]
        }
    }
};

const adminPanelMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "ADMIN PANEL",
            "buttons": [addOrganizatorButton]
        }
    }
};

export default {
    greetingMessage,
    contactingUsMessage,
    registrationNeedMessage,
    organizatorPanelMessage,
    adminPanelMessage
}