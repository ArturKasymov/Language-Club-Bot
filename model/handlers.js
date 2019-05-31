const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com/v2.6/';

var request = require('../index.js').request;

// postbacks
const GREETING = 'GREETING';
const START_REGISTRATION_YES = 'START_REGISTRATION_YES';
const START_REGISTRATION_NO = 'START_REGISTRATION_NO';
const CANCEL = 'CANCEL';

function handleMessage(sender_psid, message) {
    // check if it is a location message
    console.log('handleMEssage message:', JSON.stringify(message));


    //if(Math.random() >= 0.5){
    handlePostback(sender_psid, { payload: GREETING });
    return;
    /*}else {
		//temp
		const resendPayload = {
			"text": message.text.substring(0, 200)
		}
		callSendAPI(sender_psid, resendPayload);
		return;
	}*/
}

function handlePostback(sender_psid, received_postback) {
    // Get the payload for the postback
    const payload = received_postback.payload;

    switch (payload) {
        case GREETING:
            handleGreetingPostback(sender_psid);
            //updateStatus(sender_psid, payload, handleGreetingPostback);
            break;
        case START_REGISTRATION_YES:
            handleRegistrationStart(sender_psid);
            break;
        default:
            console.log('Cannot differentiate the payload type');
    }
}




function handleGreetingPostback(sender_psid) {
    request({
        url: `${FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN,
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
                          "payload": START_REGISTRATION_YES,
                      },
                      {
                          "type": "postback",
                          "title": "Connect with us",
                          "payload": START_REGISTRATION_NO,
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
        url: `${FACEBOOK_GRAPH_API_BASE_URL}${sender_psid}`,
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN,
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
                          "payload": CANCEL,
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
    handleMessage: handleMessage
}