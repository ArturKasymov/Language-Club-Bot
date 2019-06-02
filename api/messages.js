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