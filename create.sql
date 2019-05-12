CREATE OR REPLACE FUNCTION get_language_levels() RETURNS varchar[] AS
$$
BEGIN
RETURN array['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Proficient', 'Native speaker'];
END
$$ language plpgsql;

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
  "nickname" varchar NOT NULL
);

CREATE TABLE "languages" (
  "userID" varchar NOT NULL,
  "langName" varchar NOT NULL,
  "levelName" varchar NOT NULL,
  CONSTRAINT lang_pr_key PRIMARY KEY ("userID", "langName"),
  CHECK ("levelName" = ANY(get_language_levels()))
);

CREATE TABLE "meetings" (
  "id" SERIAL PRIMARY KEY,
  "placeID" int NOT NULL,
  "description" varchar NOT NULL,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL
  check ("startDate" < NOW()),
  check ("startDate" < "endDate")
);

CREATE TABLE "meetingVisitors" (
  "userID" varchar NOT NULL,
  "meetingID" int NOT NULL
);

CREATE TABLE "places" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "description" varchar,
  "city" varchar NOT NULL,
  "adres" varchar NOT NULL,
  "description" varchar,
  "foto" varchar
);

CREATE TABLE "conversations" (
  "conversationID" SERIAL PRIMARY KEY,
  "meetingID" int,
  "firstUser" varchar,
  "secondUser" varchar,
  CHECK ("firstUser" != "secondUser"),
  CHECK (common_languages("firstUser", "secondUser")::text != '{}')
);

CREATE TABLE "admins" (
  "userID" varchar,
  "permissionLVL" int,
  "meetingID" int
);

ALTER TABLE "languages" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetings" ADD FOREIGN KEY ("placeID") REFERENCES "places" ("id");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("firstUser") REFERENCES "users" ("facebookID");

ALTER TABLE "conversations" ADD FOREIGN KEY ("secondUser") REFERENCES "users" ("facebookID");

ALTER TABLE "admins" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "admins" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

CREATE INDEX user_in_languages ON languages("userID");
CREATE INDEX user_in_users ON users("facebookID");
CREATE INDEX meeting_in_meetings ON meetings(id);

CREATE OR REPLACE FUNCTION meetings_insert() returns trigger as $meetings_insert$
DECLARE
k record;
BEGIN
    FOR k IN (SELECT * FROM "meetings") LOOP
        IF (tsrange(k."startDate", k."endDate") && tsrange(new."startDate", new."endDate") = false) THEN
            RAISE EXCEPTION 'The place is not free at that time.';
        END IF;
    END LOOP;
    RETURN NEW;
END;
$meetings_insert$ language plpgsql;

CREATE TRIGGER meetings_insert BEFORE INSERT OR UPDATE ON "meetings" FOR EACH ROW EXECUTE PROCEDURE meetings_insert();

CREATE OR REPLACE FUNCTION languages_insert() returns trigger as $languages_insert$
BEGIN
    NEW."langName" = LOWER(NEW."langName");
    RETURN NEW;
END
$languages_insert$ language plpgsql;

CREATE TRIGGER languages_insert BEFORE INSERT ON "languages" FOR EACH ROW EXECUTE PROCEDURE languages_insert();

CREATE OR REPLACE FUNCTION get_languages_on_meeting(id int) returns varchar[] as
$$
DECLARE
result varchar[];
k record;
BEGIN
    FOR k in (SELECT l.* FROM "meetingVisitors" mv LEFT JOIN "languages" l ON mv."userID"=l."facebookID" WHERE mv."meetingID"=id) LOOP
        IF result && array[k."langName"] = false THEN
            result = k."langName" || result;
        END IF;
    END LOOP;
    RETURN result;
END
$$
language plpgsql;

CREATE OR REPLACE FUNCTION get_future_meetings(city varchar) returns TABLE(name varchar, adres varchar, "startDate" timestamp with time zone, "endDate" timestamp with time zone) AS
$$
BEGIN
    RETURN QUERY SELECT p.name, p.adres, m."startDate", m."endDate" FROM meetings m LEFT JOIN places p ON m.id=p.id WHERE p.city=city;
END
$$ language plpgsql;

INSERT INTO "users" VALUES ('a1b2c3d4e5f6g7h', 'admin');
INSERT INTO "users" VALUES ('abcdef1234zzzzz', 'demian');
INSERT INTO "users" VALUES ('123456789101112', 'artur');

INSERT INTO "places" VALUES (DEFAULT, 'Caffee', 'Krakow', 'Ul. Golebia');
INSERT INTO "places" VALUES (DEFAULT, 'Galeria Echo', 'Kielce', 'Ul. Swietokrzyska', NULL ,'https://photo.com/photo1');

INSERT INTO "meetings" VALUES (DEFAULT, 1,'First Club Meeting', NOW()-'1 year'::interval, NOW()-'11 months 30 days 18 hours 30 min'::interval);

INSERT INTO "languages" VALUES ('abcdef1234zzzzz', 'English', 'Advanced');
INSERT INTO "languages" VALUES ('abcdef1234zzzzz', 'Polish', 'Upper-Intermediate');
INSERT INTO "languages" VALUES ('123456789101112', 'English', 'Advanced');
INSERT INTO "languages" VALUES ('123456789101112', 'Polish', 'Intermediate');
INSERT INTO "languages" VALUES ('a1b2c3d4e5f6g7h', 'Polish', 'Proficient');

INSERT INTO "admins" VALUES ('123456789101112', 0, 1);

INSERT INTO "conversations" VALUES (DEFAULT, 1, 'abcdef1234zzzzz', '123456789101112');

INSERT INTO "meetingVisitors" VALUES ('abcdef1234zzzzz', 1);
INSERT INTO "meetingVisitors" VALUES ('123456789101112', 1);

CREATE OR REPLACE FUNCTION startMeeting(meetingid int) returns void as
$$
BEGIN
EXECUTE FORMAT('create or replace view %I as select "conversationID", "firstUser", "secondUser" from conversations where "meetingID"=%L', 'meeting'||meetingid::text, meetingid);
END
$$ language plpgsql;

CREATE OR REPLACE FUNCTION finishMeeting(meetingid int) returns void as
$$
BEGIN
EXECUTE FORMAT('drop view if exists %I', 'meeting'||meetingid::text);
END
$$ language plpgsql;
