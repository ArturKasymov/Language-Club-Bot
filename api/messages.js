const CONSTANTS = require('../model/Constants.js');

const SERVER_URL = process.env.SERVER_URL;


//Buttons
const chooseLanguagesButton = {
    "type": "web_url",
    "url": `${SERVER_URL}/langs`,
    "title": "Languages",
    "webview_height_ratio": "full",
    messenger_extensions: true,
};

const backButton = {
    "type": "postback",
    "title": "Back",
    "payload": CONSTANTS.BACK
};

const registrationButton = {
  "type": "postback",
  "title": "Start Registration",
  "payload": CONSTANTS.START_REGISTRATION_YES
}

const contactUsButton = {
  "type": "postback",
  "title": "Contact us",
  "payload": CONSTANTS.CONTACT_US
}

const myAccountButton = {
  "type": "postback",
  "title": "      My Account",
  "payload": CONSTANTS.MY_ACCOUNT
}

const meetingsButton = {
  "type": "postback",
  "title": "      Meetings",
  "payload": CONSTANTS.MEETINGS
}

const createMeetingButton = {
  "type": "postback",
  "title": "   Create meeting",
  "payload": CONSTANTS.CREATE_MEETING
}

const adminPanelButton = {
  "type": "postback",
  "title": "   Admin panel   ",
  "payload": CONSTANTS.ADMIN_PANEL
}

const addOrganizatorButton = {
  "type": "postback",
  "title": "   Add Organizator   ",
  "payload": CONSTANTS.ADMIN_PANEL
}

//Messages
const greetingMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Would you like to join our Language Club?",
            "buttons": [registrationButton,contactUsButton]
        }
    }
};

const nicknameReqMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Please, type in your nickname: ",
            "buttons": [backButton]
        }
    }
};

const contactingUsMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Everything you will write here now will be seen by admins.",
            "buttons": [backButton]
        }
    }
};

const chooseLanguagesTemplate = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Click on this url to choose your languages: ",
            "buttons": [chooseLanguagesButton, backButton]
        }
    }
};

const userMenu ={
    "attachment": {
        "type": "template",
        "payload":{
            "template_type": "button",
            "text" : "Menu",
            "buttons": [myAccountButton, meetingsButton]
        }
    }
};

const organizatorMenu ={
    "attachment": {
        "type": "template",
        "payload":{
            "template_type": "button",
            "text" : "Menu",
            "buttons": [myAccountButton, meetingsButton, createMeetingButton]
        }
    }
};

const adminMenu ={
    "attachment": {
        "type": "template",
        "payload":{
            "template_type": "button",
            "text" : "Menu",
            "buttons": [myAccountButton, meetingsButton, adminPanelButton]
        }
    }
};
export default {
    greetingMessage,
    nicknameReqMessage,
    contactingUsMessage,
    chooseLanguagesTemplate,
    userMenu,
    organizatorMenu,
    adminMenu
}