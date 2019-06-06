Language Club Bot
It's a semester project for Data Engineering course on Theoretical Computer Science department of Jagiellonian University.

The database is used to store the data about current club members, their levels of knowledge of various languages and club meetings. It gives an opportunity to speed up the process of organizing, maintaining and controlling a club meeting, which involves registration, creation of conversations graph and administration.

Meeting procedure
1) Registration
2) Confirmation of participation exactly at the meeting
3) Face-to-face conversations with all other participants

Bot functionality
1) User sign up (choosing languages and their levels of knowledge)
2) List of all future meetings
3) Registration for the future meeting
4) Sending information about the interlocutors while meeting
5) List of all previous interlocutor
6) Sending messages from users to admin
extra functionality for admins
7) Approving a club member participation in the meeting
8) Adding a new meeting
9) Adding a new admin

Сhanges in the database compared to the first stage:
1)Adding column status to table users for handling bot events.
2)Deleting column levelName from table languages due to useless in bot.
3)Deleting conversationID from table conversations, adding column rowNumber and changing primary key for more functionality.
4)Adding new functions to simplify work with the database.
5)Adding enums instead of some functions.

Bot working mode:
We host our bot on heroku.com as web dyno, so:
If Bot receives no web traffic in a 30-minute period, it will go into sleep mode.
If Bot is in sleep mode, it becomes active from any request (nearly 10-20 seconds).

Instruction on how to test exist bot:
1) Accept our invitation to test the bot (works only from browser version of Facebook).
2) Write to Language Club page from Facebook Messanger on your phone.

Instruction on how to independently start a project from sources:
I)Requirements:
  1)Facebook Developer Account
  2)Account on heroku.com
  3)Account on github.com
II)Steps
  1)Create new PostrgeSQL database and fill it by create.sql from src.tar
  2)Copy files from src.tar to a new gihhub repo
  3)Create new app on heroku.com and connect it to your gihhub repo
  4)Create Facebook Page (https://www.facebook.com/pages/create)
  5)Create Facebook App 
    login to https://developers.facebook.com/ and then click "Get Started". It will turn the facebook account 
    to be a developer account. After successful conversion, login to developers.facebook.com, and click "Get Started" to complete the       setup. Then click "Add a New App" to add the chatbot as an app. Add a name for the App and provide a contact email. Then click      
    "Create App ID" , and proceed with the "entering these characters in the box" security check. After the app ID is created, you will
    see the Chatbot dashboard. Click Settings → Basic. And choose "Business and Pages" under Category (According to the categories 
    information help link, page app is under this category). Then click “Save Changes” in the bottom right hand corner.
  6)Add Messenger to Facebook App
    In the right hand side menu of the dashboard, click "+ Add Product". Choose "Messenger" and click "Set Up".
    After it is setup, you can see “Messenger” added under the “PRODUCTS” menu on the right hand side. We will revisit this Messenger
    configuration later to hook up the app with our facebook page and hook up the app with backend code.
  7)Setup webhook
    (Extra information on https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup)
    Choose webhooks on Messanger configurations. Click 'choose events' and mark:
    messages, messaging_postbacks, messaging_optins, message_deliveries, message_reads, messaging_payments, messaging_pre_checkouts,
    messaging_checkout_updates, messaging_account_linking, messaging_referrals, message_echoes, standby, messaging_policy_enforcement.
    Choose your Facebook Page below.
    As request url use https://<your heroku app name>.herokuapp.com/webhook , as VERIFICATION_TOKEN write any string.
  8)Heroku deploy
    Open https://dashboard.heroku.com/apps/<your heroku app name>/settings -> Config vars and define:
    DB_HOST, 
    DB_NAME, 
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
    SERVER_URL (https://<your heroku app name>.herokuapp.com),
    VERIFICATION_TOKEN (From Facebook setup step),
    PAGE_ACCESS_TOKEN (Go back to the Facebook App Dashboard, select Settings under PRODUCTS → Messenger. In the Token Generation 
    section, select Environment under Page)
    Enable Automatic deploys on https://dashboard.heroku.com/apps/<your heroku app name>/deploy/github
  
Authors
Demian Banakh (Fisrt stage: database triggers and functions, Second Stage: js react webviews, js-postgreSQL connection)
Artur Kasymov (Fisrt stage: database tables and references, Second Stage: small rewrites of database scheme, write code uses Facebook Messenger API)