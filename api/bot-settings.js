import api from './api';

const SERVER_URL = process.env.SERVER_URL;

const botsettingsMessage = {
	"whitelisted_domains": [`${SERVER_URL}`],
	"get_started": {
		"payload": "GET_STARTED"
	},
	"persistent_menu":
	[{
  		"locale":"default",
  		"call_to_actions":[
  		{
  			"title":"My profile",
  			"type":"nested",
  			"call_to_actions":
  			[{ 
            	"title": "Nickname",
            	"type": "web_url",
            	"url": `${SERVER_URL}/nickname`,
            	"webview_height_ratio":"compact",
            	"messenger_extensions": true,
            	"webview_share_button": "hide"
          	},
          	{
            	"title": "Languages",
            	"type": "web_url",
            	"url": `${SERVER_URL}/languages`,
            	"webview_height_ratio":"full",
            	"messenger_extensions": true,
            	"webview_share_button": "hide"
          	}]
  		},
      	{
        	"title": "Meetings",
        	"type":"nested",
        	"payload" : "MEETINGS",
        	"call_to_actions":
        	[{
            	"title": "Future meetings",
            	"type": "web_url",
            	"url": `${SERVER_URL}/futuremeetings`,
            	"webview_height_ratio":"full",
            	"messenger_extensions": true,
            	"webview_share_button": "hide"
          	},
          	{
            	"title": "History",
            	"type": "web_url",
            	"url": `${SERVER_URL}/historymeetings`,
            	"webview_height_ratio":"full",
            	"messenger_extensions": true,
            	"webview_share_button": "hide",
          	}]
      	},
  		{
  			"title":"Contact us",
  			"type":"postback",
  			"payload":"CONTACT_US"
  		}]
  }]
}

function setSettings(){
	api.callBotProfileApi(botsettingsMessage);
}

export default {
    setSettings
};