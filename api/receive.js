import sendApi from './send';
const CONSTANTS = require('../model/Constants.js');

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
    //logger.fbLog("referral", payload, senderId);
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

    sendApi.sendReadReceipt(sender_psid);

    // check if it is a location message
    console.log('handleMessage message:', JSON.stringify(message));

    query(CONSTANTS.GET_STATUS, [sender_psid])
    .then((status) => {
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

    request({
        url: `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: CONSTANTS.PAGE_ACCESS_TOKEN,
            fields: "first_name"
        },
        method: "GET"
    }, function (error, response, body) {
        var langRequest = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            langRequest = name + ", click on this url to choose your languages: ";
        }
        const message = langRequest;
        const langPayload = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message,
                    "buttons": [
                      {
                          "type": "web_url",
                          "url": "https://language-club-bot.herokuapp.com/",
                          "title": "Languages",
                          "webview_height_ratio": "full"
                      }
                    ]
                }
            }
        };
        callSendAPI(sender_psid, langPayload);
    });
}

function handleRegistrationStart(sender_psid) {
    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.STARTED_REGISTRATION, sender_psid]);

    request({
        url: `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: CONSTANTS.PAGE_ACCESS_TOKEN,
            fields: "first_name"
        },
        method: "GET"
    }, function (error, response, body) {
        var nicknameRequest = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            nicknameRequest = name + ", type in your nickname: ";
        }
        const message = nicknameRequest;
        const nickNamePayload = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message,
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
        callSendAPI(sender_psid, nickNamePayload);
    });
}

function handleContactUs(sender_psid) {
    query(CONSTANTS.UPDATE_STATUS, [CONSTANTS.CONTACTING_US, sender_psid]);

    request({
        url: `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: CONSTANTS.PAGE_ACCESS_TOKEN,
            fields: "first_name"
        },
        method: "GET"
    }, function (error, response, body) {
        var contactUsRequest = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            contactUsRequest = name + ", everything you will write here now will be seen by admins.";
        }
        const message = contactUsRequest;
        const contactUsPayload = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message,
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
        callSendAPI(sender_psid, contactUsPayload);
    });
}

function handleBack(sender_psid) {
    query(CONSTANTS.BACK, sender_psid)
    .then((status) => {
        request({
            url: `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
            qs: {
                access_token: CONSTANTS.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, function (error, response, body) {
            var outputRequest = "";
            if (error) {
                console.log("Error getting user's name: " + error);
                return;
            }
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            var message = "";
            var outputPayload = {};
            switch (status) {
                case CONSTANTS.GOT_STARTED:
                    outputRequest = "Hi " + name + ". Would you like to join our Language Club?";
                    message = outputRequest;
                    outputPayload = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "button",
                                "text": message,
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
                    callSendAPI(sender_psid, outputPayload);
                    break;
                case CONSTANTS.STARTED_REGISTRATION:
                    outputRequest = name + ", type in your nickname: ";
                    message = outputRequest;
                    outputPayload = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "button",
                                "text": message,
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
                    callSendAPI(sender_psid, outputPayload);
                    break;
                case CONSTANTS.GOT_NICKNAME:
                    outputRequest = name + ", choose your languages: ";
                    message = outputRequest;
                    var elements = [];
                    for (i in languages) {
                        elements.push({
                            "title": languages[i],
                            "subtitle": '',
                            "buttons": [
                                {
                                    "title": "add",
                                    "type": "postback",
                                    "payload": languages[i]
                                },
                            ]
                        });
                    };
                    outputPayload = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "list",
                                "top_element_style": "compact",
                                "elements": elements,
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
                    callSendAPI(sender_psid, outputPayload);
                    break;
                default:
                    break;

            }
            
        });
    });
}

export default {
  handleReceivePostback,
  handleReceiveMessage,
  handleReceiveReferral
};