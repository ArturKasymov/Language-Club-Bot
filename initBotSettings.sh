curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "GET_STARTED"},
  "persistent_menu":[
  {
  	"locale":"default",
  	"call_to_actions":[
  		{
  			"title":"My profile",
  			"type":"nested",
  			"call_to_actions":[
          { 
            "title": "Nickname",
            "type": "web_url",
            "url": "https://language-club-bot.herokuapp.com/nickname",
            "webview_height_ratio":"compact",
            "messenger_extensions": true,
            "webview_share_button": "hide"
          },
          {
            "title": "Languages",
            "type": "web_url",
            "url": "https://language-club-bot.herokuapp.com/languages",
            "webview_height_ratio":"full",
            "messenger_extensions": true,
            "webview_share_button": "hide"
          }
        ]
  		},
      {
        "title": "Meetings",
        "type":"nested",
        "payload" : "MEETINGS",
        "call_to_actions":[
          {
            "title": "Future meetings",
            "type": "web_url",
            "url": "https://language-club-bot.herokuapp.com/futuremeetings",
            "webview_height_ratio":"full",
            "messenger_extensions": true,
            "webview_share_button": "hide"
          },
          {
            "title": "History",
            "type": "web_url",
            "url": "https://language-club-bot.herokuapp.com/historymeetings",
            "webview_height_ratio":"full",
            "messenger_extensions": true,
            "webview_share_button": "hide",
          }
        ]
      },
  		{
  			"title":"Contact us",
  			"type":"postback",
  			"payload":"CONTACT_US"
  		}
  	]
  }]

}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"