const CONSTANTS = require('./Constants.js');
const request = CONSTANTS.request;

const query = require('./db.js');

const languages=['english', 'deutsch','polish','ukrainian','russian'];

function callSendAPI(sender_psid, response) {
    // Construct the message body
    console.log('message to be sent: ', response);
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "url": `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}me/messages`,
        "qs": { "access_token": CONSTANTS.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        console.log("Message Sent Response body:", body);
        if (err) {
            console.error("Unable to send message:", err);
        }
    });
}

function handleMessage(sender_psid, message) {
    // check if it is a location message
    console.log('handleMessage message:', JSON.stringify(message));

    query(CONSTANTS.GET_STATUS, [sender_psid])
    .then((status) => {
        console.log("status: " + status);
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

function handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    const payload = received_postback.payload;

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
        default:
            console.log('Cannot differentiate the payload type');
    }
}





function handleGetStartedPostback(sender_psid) {
    query(CONSTANTS.INSERT_USER, [sender_psid, CONSTANTS.GOT_STARTED]);

    request({
        url: `${CONSTANTS.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: CONSTANTS.PAGE_ACCESS_TOKEN,
            fields: "first_name"
        },
        method: "GET"
    }, function (error, response, body) {
        var greeting = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            greeting = "Hi " + name + ". ";
        }
        //Greeting message
        const message = greeting + "Would you like to join our Language Club?";
        const greetingPayload = {
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
        callSendAPI(sender_psid, greetingPayload);
    });
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
        var nicknameRequest = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            langRequest = name + ", choose your languages: ";
        }

        var elements= [];
        for(i in languages){
            elements.push({
                "title": languages[i],
                "subtitle": '',
                "buttons": [
                    {
                        "title": "add",
                        "type":"postback",
                        "payload": languages[i]
                    },
                ]
            })
        }

        const message = langRequest;
        const langPayload = {
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
        //Greeting message
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
        var nicknameRequest = "";
        if (error) {
            console.log("Error getting user's name: " + error);
        } else {
            var bodyObj = JSON.parse(body);
            const name = bodyObj.first_name;
            nicknameRequest = name + ", everything you will write here now will be seen by admins.";
        }
        const message = contactUsRequest;
        const contactUsPayload = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": message
                }
            }
        };
        callSendAPI(sender_psid, nickNamePayload);
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
                case CONSTANTS.REGISTRATION_STARTED:
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





module.exports = {
    handlePostback: handlePostback,
    handleMessage: handleMessage,
}
