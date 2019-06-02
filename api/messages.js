const CONSTANTS = require('../model/Constants.js');

const greetingMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Would you like to join our Language Club?",
            "buttons": [
              {
                  "type": "postback",
                  "title": "Start Registration",
                  "payload": CONSTANTS.START_REGISTRATION_YES,
              },
              {
                  "type": "postback",
                  "title": "Contact us",
                  "payload": CONSTANTS.CONTACT_US,
              }
            ]
        }
    }
};

const nicknameReqMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Please, type in your nickname: ",
            "buttons": [
              {
                  "type": "postback",
                  "title": "Back",
                  "payload": CONSTANTS.BACK,
              },
            ]
        }
    }
};

const contactingUsMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Everything you will write here now will be seen by admins.",
            "buttons": [
              {
                  "type": "postback",
                  "title": "Back",
                  "payload": CONSTANTS.BACK,
              },
            ]
        }
    }
};

const chooseYourLanguagesMessage = {
    text: "Click on this url to choose your languages: "
}

const chooseLanguagesButton = {
    "type": "web_url",
    "url": "https://language-club-bot.herokuapp.com/",
    "title": "Languages",
    "webview_height_ratio": "full",
    messenger_extensions: true,
};

export default {
    greetingMessage,
    nicknameReqMessage,
    contactingUsMessage,
    chooseLanguagesButton,
}