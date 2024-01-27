CREATE TABLE wreathe_user (
user_uid UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(), 
first_name VARCHAR(30) NOT NULL, 
last_name VARCHAR(30) NOT NULL, 
email VARCHAR(100) UNIQUE,
username VARCHAR(50) NOT NULL UNIQUE,
user_password VARCHAR(100) NOT NULL
);

CREATE TABLE thread (
  thread_uid UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(), 
  content VARCHAR(500) NOT NULL, 
  isPublished BOOLEAN NOT NULL,
  thread_timestamp TIMESTAMPTZ DEFAULT NOW()
  author_ref UUID REFERENCES wreathe_user(user_uid),
  comments_ref UUID[],
  likes UUID[]
);

CREATE TABLE comment (
  comment_uid UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(), 
  content VARCHAR(500) NOT NULL, 
  isPublished BOOLEAN NOT NULL,
  comment_timestamp TIMESTAMPTZ DEFAULT NOW(),
  thread_ref UUID REFERENCES thread(thread_uid),
  author_ref UUID REFERENCES wreathe_user(user_uid),
  likes UUID[] 
);

CREATE TABLE messenger (
  message_uid UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(), 
  content VARCHAR(1000) NOT NULL, 
  message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  author_ref UUID REFERENCES wreathe_user(user_uid),
  recepient_ref UUID REFERENCES wreathe_user(user_uid)
);

-- CREATE TABLE subscribers (
--   user_id UUID REFERENCES wreathe_user(user_id),
--   subscriber_id UUID REFERENCES wreathe_user(user_id),
--   PRIMARY KEY (user_id, subscriber_id)
-- );