const CONSTANTS = require('../model/Constants.js');

const SERVER_URL = process.env.SERVER_URL;


//Buttons
const profileSetUpButton = {
    "type": "web_url",
    "url": `${SERVER_URL}/registration`,
    "title": "My Profile",
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

const changeNicknameButton = {
  "type": "postback",
  "title": " Change Nickname",
  "payload": CONSTANTS.CHANGE_NICKNAME
}

const meetingsButton = {
  "type": "postback",
  "title": "      Meetings",
  "payload": CONSTANTS.MEETINGS
}

const myMeetingsButton = {
  "type": "postback",
  "title": "      My meetings",
  "payload": CONSTANTS.MY_MEETINGS
}

const adminPanelButton = {
  "type": "postback",
  "title": "   Admin panel",
  "payload": CONSTANTS.ADMIN_PANEL
}

const createMeetingButton = {
  "type": "postback",
  "title": "   Create meeting",
  "payload": CONSTANTS.CREATE_MEETING
}

const addOrganizatorButton = {
  "type": "postback",
  "title": "   Add Organizator",
  "payload": CONSTANTS.ADDING_ORGANIZATOR
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

const profileSetUpTemplate = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Set up your profile by choosing nickname and the languages your speak: ",
            "buttons": [profileSetUpButton, backButton]
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
    contactingUsMessage,
    profileSetUpTemplate,
    userMenu,
    organizatorMenu,
    adminMenu
}