CREATE type lang_name_t as enum( 
  'english', 'arabic', 'polish', 'german', 'french', 'chinese', 'russian',
  'ukrainian', 'spanish', 'hindi', 'portuguese', 'japanese', 'korean',
  'turkish', 'italian', 'hebrew', 'finnish', 'swedish', 'norwegian',
  'danish', 'irish', 'hungarian', 'bulgarian', 'persian', 'serbian',
  'slovak', 'czech', 'greek', 'latin', 'lithuanian', 'latvian', 'estonian');

CREATE OR REPLACE FUNCTION getLanguagesArray() RETURNS varchar [] AS
$$
BEGIN
    RETURN (SELECT enum_range(NULL::lang_name_t));
END
$$ language plpgsql; 

CREATE OR REPLACE type perm_level_t as enum('0','1','2','3');

CREATE OR REPLACE FUNCTION get_user_languages(id varchar) RETURNS varchar[] AS
$$
BEGIN
    RETURN array(SELECT DISTINCT "langName" FROM "languages" WHERE "userID"=id);
END
$$ language plpgsql;

CREATE OR REPLACE FUNCTION common_languages(idf varchar, ids varchar) RETURNS varchar[] AS
$$
DECLARE
langsf varchar[];
langss varchar[];
BEGIN
    langsf := get_user_languages(idf);
    langss := get_user_languages(ids);
    RETURN array(SELECT unnest(langsf) INTERSECT SELECT unnest(langss));
END
$$ language plpgsql;

CREATE TABLE "users" (
  "facebookID" varchar PRIMARY KEY,
  "status" varchar NOT NULL,
  "nickname" varchar,
  "permissionLevel" perm_level_t
);

CREATE TABLE "languages" (
  "userID" varchar NOT NULL,
  "langName" lang_name_t NOT NULL,
  CONSTRAINT lang_pr_key PRIMARY KEY ("userID", "langName")
);

CREATE TABLE "places" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "city" varchar NOT NULL,
  "adress" varchar NOT NULL,
  "description" varchar,
  "photo" varchar
);

CREATE TABLE "meetings" (
  "id" SERIAL PRIMARY KEY,
  "placeID" int NOT NULL,
  "organizerID" varchar NOT NULL,
  "description" varchar NOT NULL,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL
  check ("startDate" >= NOW()),
  check ("startDate" < "endDate")
);

CREATE TABLE "meetingVisitors" (
  "userID" varchar NOT NULL,
  "meetingID" int NOT NULL,
  "isPresent" boolean NOT NULL,
  CONSTRAINT unique_user_meeting UNIQUE ("userID", "meetingID") 
);

CREATE TABLE "conversations" (
  "meetingID" int NOT NULL,
  "rowNumber" int NOT NULL,
  "firstUser" varchar NOT NULL,
  "secondUser" varchar NOT NULL,
  CHECK ("firstUser" != "secondUser"),
  CHECK (common_languages("firstUser", "secondUser")::text != '{}'),
  CONSTRAINT pk_conversations PRIMARY KEY ("rowNumber", "meetingID", "firstUser", "secondUser") 
);
  

ALTER TABLE "languages" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetings" ADD FOREIGN KEY ("placeID") REFERENCES "places" ("id");

ALTER TABLE "meetings" ADD FOREIGN KEY ("organizerID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("firstUser") REFERENCES "users" ("facebookID");

ALTER TABLE "conversations" ADD FOREIGN KEY ("secondUser") REFERENCES "users" ("facebookID");

CREATE OR REPLACE FUNCTION onInsertConversations() returns trigger as $onInsertConversations$
DECLARE
r record;
BEGIN
    r= (SELECT * FROM "conversations" WHERE rowNumber=NEW.rowNumber AND "firstUser"=NEW.secondUser AND secondUser=NEW.firstUser);
    END IF;
    IF(r IS NULL) THEN return NEW; else RETURN NULL; END IF;
END;
$onInsertConversations$ language plpgsql;
  
CREATE TRIGGER onInsertConversations BEFORE INSERT OR UPDATE ON "conversations" FOR EACH ROW EXECUTE PROCEDURE onInsertConversations();
  
CREATE OR REPLACE FUNCTION meetings_insert() returns trigger as $meetings_insert$
DECLARE
k record;
BEGIN
  IF(TG_OP='INSERT') THEN
    FOR k IN (SELECT * FROM "meetings") LOOP
        IF (tsrange(k."startDate"::timestamp, k."endDate"::timestamp) && tsrange(new."startDate"::timestamp, new."endDate"::timestamp) = true AND (k."placeID"=new."placeID" OR k."organizerID"=new."organizerID")) THEN
            IF (k."placeID"=new."placeID") THEN RAISE EXCEPTION 'The place is not free at that time.'; END IF;
            IF (k."organizatorID"=new."organizatorID") THEN RAISE EXCEPTION 'This organizer is not free at that time.'; END IF;
        END IF;
    END LOOP;
    RETURN NEW;
  ELSEIF(TG_OP='UPDATE') THEN
    FOR k IN (SELECT * FROM "meetings") LOOP
        IF (tsrange(k."startDate"::timestamp, k."endDate"::timestamp) && tsrange(new."startDate"::timestamp, new."endDate"::timestamp) = true AND (k."placeID"=new."placeID" OR k."organizerID"=new."organizerID") AND k.id!=new.id) THEN
            IF (k."placeID"=new."placeID") THEN RAISE EXCEPTION 'The place is not free at that time.'; END IF;
            IF (k."organizatorID"=new."organizatorID") THEN RAISE EXCEPTION 'This organizer is not free at that time.'; END IF;
        END IF;
    END LOOP;
    RETURN NEW;
  END IF;
END;
$meetings_insert$ language plpgsql;

CREATE TRIGGER meetings_insert BEFORE INSERT OR UPDATE ON "meetings" FOR EACH ROW EXECUTE PROCEDURE meetings_insert();

CREATE OR REPLACE FUNCTION startMeeting(meetingid int) returns void as
$$
BEGIN
EXECUTE FORMAT('create view %I as select "rowNumber", "firstUser", "secondUser" from conversations where "meetingID"=%L', 'meeting'||meetingid::text, meetingid);
END
$$ language plpgsql;

CREATE OR REPLACE FUNCTION getTempMeetingData(meetingid int) returns 
TABLE("rowNumber" int, "firstUser" varchar, "secondUser" varchar) AS
$$
BEGIN
  EXECUTE FORMAT('SELECT * FROM %I', 'meeting'||meetingid::text);
END
$$ language plpgsql;

CREATE OR REPLACE FUNCTION finishMeeting(meetingid int) returns void as
$$
BEGIN
EXECUTE FORMAT('drop view if exists %I', 'meeting'||meetingid::text);
END
$$ language plpgsql;



create or replace function getFutureMeetingsList(user_id varchar) returns 
table(id int, "placeID" int, place_name varchar, place_city varchar, place_address varchar, "organizerID" varchar, organizer_nickname varchar, description varchar, "startDate" timestamptz, "endDate" timestamptz, registered bool) 
as $$
begin 
return query (
  select m.id, p.id, p.name, p.city, p.adress, m."organizerID", u."nickname", m.description, m."startDate", m."endDate", (case when mv."userID" is null then false else true end) 
  from meetings m left join users u on m."organizerID"=u."facebookID" 
  left join places p on m."placeID"=p.id 
  left join "meetingVisitors" mv ON mv."meetingID"=m.id 
  where (mv."userID"=user_id or mv."userID" is null) AND m."startDate" > NOW()); 
end $$ language plpgsql;

CREATE OR REPLACE FUNCTION getHistoryMeetingsList(user_id varchar) returns 
TABLE(id int, "placeID" int, place_name varchar, place_city varchar, place_address varchar, "organizerID" varchar, organizer_nickname varchar, description varchar, "startDate" timestamptz, "endDate" timestamptz) 
AS $$
BEGIN
RETURN QUERY (
  SELECT m.id, p.id, p.name, p.city, p.adress, m."organizerID", u.nickname, m.description, m."startDate", m."endDate" 
  FROM meetings m LEFT JOIN users u ON m."organizerID"=u."facebookID" 
  LEFT JOIN places p ON p.id=m."placeID" 
  LEFT JOIN "meetingVisitors" mv ON mv."meetingID"=m.id 
  WHERE mv."userID"=user_id AND m."endDate" < NOW());
END $$ language plpgsql;

CREATE OR REPLACE FUNCTION getUsersMeetingPartners(meetingID int, userID varchar) returns
TABLE("partnerID" varchar, "partnerNickname" varchar)
AS
$$
BEGIN
RETURN QUERY( 
  SELECT DISTINCT c."firstUser", u.nickname
  FROM conversations c JOIN users u ON u."facebookID"=c."firstUser"
  WHERE c."meetingID"=meetingID AND c."secondUser"=userID
  UNION
  SELECT DISTINCT c."secondUser", u.nickname
  FROM conversations c JOIN users u ON u."facebookID"=c."secondUser"
  WHERE c."meetingID"=meetingID AND c."firstUser"=userID
);
END
$$ language plpgsql;


create or replace function getMeetingsList(org_id varchar) 
returns table(id int, "placeID" int, place_name varchar, place_city varchar, place_address varchar, "organizerID" varchar, organizer_nickname varchar, description varchar, "startDate" timestamptz, "endDate" timestamptz) as 
begin 
return query (select m.id, p.id, p.name, p.city, p.adress, m."organizerID", u."nickname", m.description, m."startDate", m."endDate" from meetings m left join users u on m."organizerID"=u."facebookID" left join places p on m."placeID"=p.id where m."organizerID"=org_id and m."startDate" > NOW());
end $$ language plpgsql;

CREATE OR REPLACE FUNCTION getAdministratedMeeting(organizatorID varchar) returns
TABLE (id int, "meetingDescription" varchar,  "startDate" timestamp with time zone, "endDate" timestamp with time zone, 
  city varchar, adress varchar, placename varchar)
AS
$$
BEGIN
RETURN QUERY( 
    SELECT m.id, m.description, m."startDate", m."endDate", p.city, p.adress, p.name
    FROM meetings m JOIN places p ON p.id=m."placeID" WHERE m."startDate"> NOW() AND m."organizerID"=organizatorID
    ORDER BY m."startDate" LIMIT 1
);
END
$$ language plpgsql;

    
INSERT into users VALUES('2469714086386843', 'MAIN', 'Demian', '1');
INSERT into users VALUES('2066560726803687', 'MAIN', 'Artur', '2');


INSERT into places(name, city,adress,description,photo) VALUES( 'TCS','Krakow','Łojasiewicza 6', NULL, NULL);
INSERT into places(name, city,adress,description,photo) VALUES( 'UJ','Krakow','Gołębia 24', NULL, NULL);

INSERT INTO meetings("placeID","organizerID","description","startDate","endDate") VALUES(2,'2066560726803687', 'first meeting', '2020-06-22 19:10:25','2020-07-22 19:10:25');
INSERT INTO meetings("placeID","organizerID","description","startDate","endDate") VALUES(3,'2469714086386843', 'second meeting', '2020-06-22 19:10:25','2020-07-22 19:10:25');

INSERT INTO "languages" VALUES ('2469714086386843', 'english');
INSERT INTO "languages" VALUES ('2469714086386843', 'polish');
INSERT INTO "languages" VALUES ('2066560726803687', 'english');
INSERT INTO "languages" VALUES ('2066560726803687', 'polish');

INSERT INTO "conversations" VALUES (DEFAULT, 1, 1 ,'abcdef1234zzzzz', '123456789101112');

INSERT INTO "meetingVisitors" VALUES ('2469714086386843', 1,true);
INSERT INTO "meetingVisitors" VALUES ('2066560726803687', 1,true);


