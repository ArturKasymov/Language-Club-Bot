const UT = require('./Constants.js');
const request = UT.request;

const pool = require('./model/db.js');

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
        "url": `${UT.FACEBOOK_GRAPH_API_BASE_URL}me/messages`,
        "qs": { "access_token": UT.PAGE_ACCESS_TOKEN },
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

    /*(async function() {
        
    })();*/
    
    handlePostback(sender_psid, { payload: UT.GREETING });
}

function handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    const payload = received_postback.payload;

    switch (payload) {
        case UT.GREETING:
            handleGreetingPostback(sender_psid);
            //updateStatus(sender_psid, payload, handleGreetingPostback);
            break;
        case UT.START_REGISTRATION_YES:
            handleRegistrationStart(sender_psid);
            break;
        default:
            console.log('Cannot differentiate the payload type');
    }
}




function handleGreetingPostback(sender_psid) {
    request({
        url: `${UT.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: UT.PAGE_ACCESS_TOKEN,
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
                          "payload": UT.START_REGISTRATION_YES,
                      },
                      {
                          "type": "postback",
                          "title": "Connect with us",
                          "payload": UT.START_REGISTRATION_NO,
                      }
                    ]
                }
            }
        };
        callSendAPI(sender_psid, greetingPayload);
    });
}

function handleRegistrationStart(sender_psid) {
    request({
        url: `${UT.FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: UT.PAGE_ACCESS_TOKEN,
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
                          "title": "Cancel",
                          "payload": UT.CANCEL,
                      },
                    ]
                }
            }
        };
        callSendAPI(sender_psid, nickNamePayload);
    });
}


/*
function updateStatus(sender_psid, status, callback){
  const query = {user_id: sender_psid};
  const update = {status: status};
  const options = {upsert: status === GREETING};

  ChatStatus.findOneAndUpdate(query, update, options).exec((err, cs) => {
    console.log('update status to db: ', cs);
    callback(sender_psid);
  });
}*/





module.exports = {
    handlePostback: handlePostback,
    handleMessage: handleMessage,
}
