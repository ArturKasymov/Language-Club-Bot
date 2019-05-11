CREATE TABLE "users" (
  "facebookID" char(15) PRIMARY KEY,
  "nickname" varchar NOT NULL
);

CREATE TABLE "languages" (
  "userID" char(15) NOT NULL,
  "langName" varchar NOT NULL,
  "levelName" varchar NOT NULL,
  CONSTRAINT lang_pr_key PRIMARY KEY ("userID", "langName")
);

CREATE TABLE "language" (
    "name" varchar PRIMARY KEY NOT NULL,
    "flag" varchar NOT NULL
);

CREATE TABLE "meetings" (
  "id" int PRIMARY KEY,
  "placeID" int NOT NULL,
  "startDate" timestamp with time zone NOT NULL,
  "endDate" timestamp with time zone NOT NULL
);

CREATE TABLE "meetingVisitors" (
  "userID" char(15),
  "meetingID" int
);

CREATE TABLE "places" (
  "id" int PRIMARY KEY,
  "name" varchar NOT NULL,
  "city" varchar NOT NULL,
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

ALTER TABLE "languages" ADD FOREIGN KEY ("langName") REFERENCES "language" ("name");

ALTER TABLE "meetings" ADD FOREIGN KEY ("placeID") REFERENCES "places" ("id");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "meetingVisitors" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");

ALTER TABLE "conversations" ADD FOREIGN KEY ("firstUser") REFERENCES "users" ("facebookID");

ALTER TABLE "conversations" ADD FOREIGN KEY ("secondUser") REFERENCES "users" ("facebookID");

ALTER TABLE "organizators" ADD FOREIGN KEY ("userID") REFERENCES "users" ("facebookID");

ALTER TABLE "organizators" ADD FOREIGN KEY ("meetingID") REFERENCES "meetings" ("id");
