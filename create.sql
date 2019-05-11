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
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL
  check ("startDate" < NOW()),
  check ("startDate" < "endDate")
);

CREATE TABLE "meetingVisitors" (
  "userID" char(15),
  "meetingID" int
);

CREATE TABLE "places" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "city" varchar NOT NULL,
  "adres" varchar NOT NULL,
  "foto" varchar
);

CREATE TABLE "conversations" (
  "meetingID" int,
  "firstUser" varchar,
  "secondUser" varchar
);

CREATE TABLE "organizators" (
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

ALTER TABLE "organizators" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "organizators" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

INSERT INTO "users" VALUES ('a1b2c3d4e5f6g7h', 'admin');
INSERT INTO "users" VALUES ('abcdef1234zzzzz', 'demian');
INSERT INTO "users" VALUES ('123456789101112', 'artur');

INSERT INTO "places" VALUES (DEFAULT, 'Caffee', 'Krakow', 'Ul. Golebia');
INSERT INTO "places" VALUES (DEFAULT, 'Galeria Echo', 'Kielce', 'Ul. Swietokrzyska', 'https://photo.com/photo1');

INSERT INTO "meetings" VALUES (DEFAULT, 1, NOW()-'1 year'::interval, NOW()-'11 months 30 days 18 hours 30 min'::interval);

INSERT INTO "languages" VALUES ('abcdef1234zzzzz', 'English', 'Advanced');
INSERT INTO "languages" VALUES ('abcdef1234zzzzz', 'Polish', 'Upper-Intermediate');
INSERT INTO "languages" VALUES ('123456789101112', 'English', 'Advanced');
INSERT INTO "languages" VALUES ('123456789101112', 'Polish', 'Intermediate');
INSERT INTO "languages" VALUES ('a1b2c3d4e5f6g7h', 'Polish', 'Proficient');

INSERT INTO "organizators" VALUES ('123456789101112', 0, 1);

INSERT INTO "conversations" VALUES (1, 'abcdef1234zzzzz', '123456789101112');

INSERT INTO "meetingVisitors" VALUES ('abcdef1234zzzzz', 1);
INSERT INTO "meetingVisitors" VALUES ('123456789101112', 1);

CREATE OR REPLACE FUNCTION get_language_levels() RETURNS varchar[] AS
$$
BEGIN
RETURN array['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced', 'Proficient'];
END
$$
language plpgsql;

