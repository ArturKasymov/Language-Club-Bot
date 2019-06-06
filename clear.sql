DROP FUNCTION IF EXISTS getAdministratedMeeting(varchar);
DROP FUNCTION IF EXISTS getUserAdministratedMeetings(varchar);
DROP FUNCTION IF EXISTS	getUsersMeetingPartners(int, varchar);
DROP FUNCTION IF EXISTS getUsersMeetingsHistory();
DROP FUNCTION IF EXISTS getFutureMeetingsList();

DROP FUNCTION IF EXISTS startMeeting(int);
DROP FUNCTION IF EXISTS getTempMeetingData(int);
DROP FUNCTION IF EXISTS finishMeeting(int);

DROP TRIGGER IF EXISTS meetings_insert ON meetings;
DROP FUNCTION IF EXISTS meetings_insert();
DROP TRIGGER IF EXISTS onInsertConversations ON conversations;
DROP FUNCTION IF EXISTS onInsertConversations();

DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS meetingVisitors CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS common_languages(varchar, varchar);
DROP FUNCTION IF EXISTS get_user_languages(varchar);
DROP TYPE IF EXISTS perm_level_t;
DROP FUNCTION IF EXISTS getLanguagesArray();
DROP TYPE IF EXISTS lang_name_t;