curl -X POST -H "Content-Type: application/json" -d '{
  "get_started": {"payload": "GET_STARTED"},
  "persistent_menu":[
  {
  	"locale":"default",
  	"composer_input_disabled": false,
  	"call_to_actions":[
  		{
  			"title":"Menu",
  			"type":"postback",
  			"payload":"MENU"
  		},
  		{
  			"title":"Contact us",
  			"type":"postback",
  			"payload":"CONTACT_US"
  		}
  	]
  }]

}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=<PAGE_ACCESS_TOKEN>"