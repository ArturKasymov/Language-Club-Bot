import express from 'express';

import receiveApi from '../api/receive';

const router = express.Router();

router.get('/', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFICATION_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

router.post('/', (req, res) => {
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

    const body = req.body;

    if (body.object === 'page') {
        if (body.entry && body.entry.length <= 0){
            return;
        }
        body.entry.forEach((pageEntry) => {
            // Iterate over each messaging event and handle accordingly
            pageEntry.messaging.forEach((messagingEvent) => {
                console.log({messagingEvent});
                if (messagingEvent.message) {
                    receiveApi.handleReceiveMessage(messagingEvent);
                } else if (messagingEvent.postback) {
                    receiveApi.handleReceivePostback(messagingEvent);
                } else if (messagingEvent.referral) {
                    receiveApi.handleReceiveReferral(messagingEvent);
                } else {
                    console.log(
                      'Webhook received unknown messagingEvent: ',
                      messagingEvent
                    );
                }
            });
        });
    }
});

export default router;