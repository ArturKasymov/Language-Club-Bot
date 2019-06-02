import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';

import request from 'request';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function callAPI(endPoint, dataArray, queryParams, retries) {
    if (!endPoint) {
        console.error('No endpoint specified');
        return;
    }

    if (retries < 0) {
        console.error(
          'No more retries left.',
          {endPoint, messageDataArray, queryParams}
        );

        return;
    }

    const query = Object.assign({access_token: PAGE_ACCESS_TOKEN}, queryParams);

    const [messageToSend, ...queue] = castArray(dataArray);
    request({
        uri: `https://graph.facebook.com/v3.2/me/${endPoint}`,
        qs: query,
        method: 'POST',
        json: messageToSend,

    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            // Message has been successfully received by Facebook.
            console.log(
              `Successfully sent message to ${endPoint} endpoint: `,
              JSON.stringify(body)
            );

            // Continue sending payloads until queue empty.
            if (!isEmpty(queue)) {
                callAPI(endPoint, queue, queryParams);
            }
        } else {
            // Message has not been successfully received by Facebook.
            console.error(
              `Failed calling Messenger API endpoint ${endPoint}`,
              response.statusCode,
              response.statusMessage,
              body.error,
              queryParams
            );

            // Retry the request
            console.error(`Retrying Request: ${retries} left`);
            callAPI(endPoint, messageDataArray, queryParams, retries - 1);
        }
    });
}

function callMessagesApi(dataArray, queryParams) {
    return callAPI('messages', dataArray, queryParams, 5);
}

export default {
    callMessagesApi
};