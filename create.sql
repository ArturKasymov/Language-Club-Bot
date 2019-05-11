CREATE TABLE "users" (
  "facebookID" char(15) PRIMARY KEY,
  "nickname" varchar NOT NULL
);

CREATE TABLE "languages" (
  "userID" char(15) NOT NULL,
  "langID" int NOT NULL,
  "levelID" int
);

CREATE TABLE "language" (
  "id" int PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "flag" varchar NOT NULL
);

CREATE TABLE "levels" (
  "id" int PRIMARY KEY,
  "name" varchar NOT NULL
);

CREATE TABLE "meetings" (
  "id" int PRIMARY KEY,
  "placeID" int NOT NULL,
  "startDate" datetime NOT NULL,
  "endDate" datetime NOT NULL
);

CREATE TABLE "meetingVisitors" (
  "userID" char(15),
  "meetingID" int
);

CREATE TABLE "places" (
  "id" int PRIMARY KEY,
  "name" varchar NOT NULL,
  "adres" varchar NOT NULL,
  "foto" varchar
);

CREATE TABLE "conversations" (
  "meetingID" int,
  "firstUser" char(15),
  "secondUser" char(15)
);

CREATE TABLE "organizators" (
  "userID" char(15),
  "permissionLVL" int,
  "meetingID" int
);

ALTER TABLE "languages" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "languages" ADD FOREIGN KEY ("langID") REFERENCES "language" ("id");

ALTER TABLE "languages" ADD FOREIGN KEY ("levelID") REFERENCES "levels" ("id");

ALTER TABLE "meetings" ADD FOREIGN KEY ("placeID") REFERENCES "places" ("id");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("firstUser") REFERENCES "users" ("facebookID");

ALTER TABLE "conversations" ADD FOREIGN KEY ("secondUser") REFERENCES "users" ("facebookID");

ALTER TABLE "organizators" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "organizators" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");