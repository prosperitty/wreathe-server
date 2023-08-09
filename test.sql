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

insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Kalvin', 'Bride', 'kbride0@csmonitor.com', 'kbride0', '$2a$04$2UWcjiPRDEpq1ek4z2bAiOwdgWQBa/7S5o/zg11iUuxLgGa4dB2s.');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Dev', 'Fretwell', 'dfretwell1@mit.edu', 'dfretwell1', '$2a$04$Eyg/XQlOak3tahrd.WwZ8O4ZJQfLDbM8tGkpxEdLPfzVgMEhlo33W');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Dorian', 'Canet', 'dcanet2@ibm.com', 'dcanet2', '$2a$04$jRwlZno7RmezJhwE/m40wuDzfnqNevRcUiZkuK450jb3JHxrMOLhO');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Shane', 'Anslow', 'sanslow3@techcrunch.com', 'sanslow3', '$2a$04$9rDVDRQTyNKM1aZxegSt4eemKKZjdIa9I9gsyeBpA5MB4Snvc/Eti');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Regina', 'Voisey', 'rvoisey4@arizona.edu', 'rvoisey4', '$2a$04$1OliFVAlevyAJzQueybwMejLbNX4SJtX0UDgteHa1jzrGAGRMHBZ2');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Nick', 'Aldersley', 'naldersley5@phoca.cz', 'naldersley5', '$2a$04$d../38zDYtReYiTcBs4nAuKoF2eLX6VTrehpi8PAWzILM8qx.2umu');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Romeo', 'Plevey', 'rplevey6@reddit.com', 'rplevey6', '$2a$04$xzvly2dIjhxH423UJ2fD.uauxd811ddMWx5wKLFBfdBmOT2W3uwzu');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Essie', 'Sanger', 'esanger7@feedburner.com', 'esanger7', '$2a$04$jsCgEvNlD7LcDlmRwVIjwefSt49rEqAkbu5LHo0KNHsSFpNii/xg2');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Walsh', 'Lorie', 'wlorie8@bing.com', 'wlorie8', '$2a$04$FCYEM7r1zSrgqjDSYsG/IO6BqW7JQY0wCd8kNoJf2GZdUXwggNJlm');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Melina', 'Hartropp', 'mhartropp9@smh.com.au', 'mhartropp9', '$2a$04$GcAkX3IgGuF6/g.rHQ/VauBRoHZEpPg6QLgMTOW1V09XMHbZ1w.tm');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Ephrayim', 'Marciskewski', 'emarciskewskia@uiuc.edu', 'emarciskewskia', '$2a$04$BDp.jorvj7EjRSpQh.qzMOJcVbEwZj34yv4kEFG6Mvp6kfPQXgeO6');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Marta', 'Petrovic', 'mpetrovicb@google.ca', 'mpetrovicb', '$2a$04$DxvN4N5HFVRpao0bvvdiN..dpJRokWkJDDa580SE1dEFy2yIcExe2');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Natassia', 'Afonso', 'nafonsoc@wix.com', 'nafonsoc', '$2a$04$B/pUpM/z1jwfFXOOpVu2COjlwK4SYPLuyDqHviqVxiPqhM1yoDw9q');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Murry', 'Frankowski', 'mfrankowskid@drupal.org', 'mfrankowskid', '$2a$04$hGrLCfVYqzywXfZOZK0sZed5pC0D/uMzv8nUIwKze/7UUStYeUxSq');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Vivianna', 'Cranmere', 'vcranmeree@ask.com', 'vcranmeree', '$2a$04$2tuZBFbdkRMYUsy31qt.YOANJ9SQz5nng93aWYjox5Sxnmt.T2fXG');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Vivyan', 'McPherson', 'vmcphersonf@smh.com.au', 'vmcphersonf', '$2a$04$YpjqdNqw3va.RqD15hkNYeZorOAv5qx4wVdBRxrntX9t6EEVgfMGW');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Garvy', 'Grayshan', 'ggrayshang@ihg.com', 'ggrayshang', '$2a$04$1yNnNoBzMU12azioEaD2m.fgpet4QV5Xw4sfNdxMz.gRyCrPQG0Lu');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Saunders', 'Cutting', 'scuttingh@t-online.de', 'scuttingh', '$2a$04$/3WbOFkoXTLuVCRo6Qn2LeuWY2TM5fT/N7zV.Ai.4EO1baWOpv9h.');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Ferris', 'Knuckles', 'fknucklesi@miibeian.gov.cn', 'fknucklesi', '$2a$04$I6h4hhlOPqowOH8IO.M6yuJj4IOMw0LHr6kOLWi5y9YB92No.7ziG');
insert into wreathe_user (first_name, last_name, email, username, user_password) values ('Ellwood', 'Nellis', 'enellisj@desdev.cn', 'enellisj', '$2a$04$hKUkYRmNJzzSXszx2Fy6cOB1LDHDdDcYq0UW8gghj5ElDCU8/dEi.');

insert into thread (content, isPublished, thread_timestamp) values ('Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.', true, '2023-02-09 03:29:34');
insert into thread (content, isPublished, thread_timestamp) values ('Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', false, '2022-11-21 16:28:22');
insert into thread (content, isPublished, thread_timestamp) values ('Integer ac neque. Duis bibendum.', true, '2022-10-19 06:16:17');
insert into thread (content, isPublished, thread_timestamp) values ('Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', false, '2022-10-03 01:26:31');
insert into thread (content, isPublished, thread_timestamp) values ('In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', true, '2023-05-29 01:44:24');
insert into thread (content, isPublished, thread_timestamp) values ('Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio.', true, '2023-03-16 06:11:26');
insert into thread (content, isPublished, thread_timestamp) values ('In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', true, '2022-10-18 10:01:56');
insert into thread (content, isPublished, thread_timestamp) values ('Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', false, '2022-10-20 13:04:49');
insert into thread (content, isPublished, thread_timestamp) values ('Morbi non lectus.', false, '2023-01-29 15:05:20');
insert into thread (content, isPublished, thread_timestamp) values ('Aliquam erat volutpat. In congue. Etiam justo.', true, '2022-09-20 07:11:37');
insert into thread (content, isPublished, thread_timestamp) values ('Vivamus tortor.', true, '2023-04-07 22:49:51');
insert into thread (content, isPublished, thread_timestamp) values ('Donec vitae nisi.', false, '2023-05-23 22:06:05');
insert into thread (content, isPublished, thread_timestamp) values ('Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum.', false, '2023-05-15 00:53:46');
insert into thread (content, isPublished, thread_timestamp) values ('Sed sagittis.', false, '2022-07-31 10:12:49');
insert into thread (content, isPublished, thread_timestamp) values ('Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', false, '2022-10-13 02:49:40');
insert into thread (content, isPublished, thread_timestamp) values ('Sed accumsan felis. Ut at dolor quis odio consequat varius.', false, '2023-07-11 17:50:37');
insert into thread (content, isPublished, thread_timestamp) values ('Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.', false, '2022-08-28 13:44:05');
insert into thread (content, isPublished, thread_timestamp) values ('Sed ante. Vivamus tortor. Duis mattis egestas metus.', false, '2022-07-28 10:47:57');
insert into thread (content, isPublished, thread_timestamp) values ('Pellentesque viverra pede ac diam.', true, '2022-07-30 04:34:15');
insert into thread (content, isPublished, thread_timestamp) values ('Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus.', false, '2022-12-19 04:14:12');

insert into comment (content, isPublished, comment_timestamp) values ('Morbi ut odio.', true, '2023-06-26 12:23:35');
insert into comment (content, isPublished, comment_timestamp) values ('Vivamus tortor. Duis mattis egestas metus. Aenean fermentum.', true, '2022-10-13 02:53:05');
insert into comment (content, isPublished, comment_timestamp) values ('In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.', false, '2023-05-01 05:06:16');
insert into comment (content, isPublished, comment_timestamp) values ('Integer ac neque. Duis bibendum.', true, '2023-05-31 09:44:10');
insert into comment (content, isPublished, comment_timestamp) values ('Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.', true, '2023-01-02 15:56:41');
insert into comment (content, isPublished, comment_timestamp) values ('Donec semper sapien a libero.', true, '2022-08-29 14:35:29');
insert into comment (content, isPublished, comment_timestamp) values ('Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.', true, '2022-08-04 22:19:52');
insert into comment (content, isPublished, comment_timestamp) values ('In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', false, '2023-06-13 00:38:33');
insert into comment (content, isPublished, comment_timestamp) values ('Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.', false, '2023-04-22 19:54:57');
insert into comment (content, isPublished, comment_timestamp) values ('Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', false, '2023-01-26 09:32:05');
insert into comment (content, isPublished, comment_timestamp) values ('Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.', false, '2022-10-11 23:30:53');
insert into comment (content, isPublished, comment_timestamp) values ('Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.', true, '2022-07-29 16:21:48');
insert into comment (content, isPublished, comment_timestamp) values ('Morbi vel lectus in quam fringilla rhoncus.', false, '2023-05-03 10:58:08');
insert into comment (content, isPublished, comment_timestamp) values ('Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', false, '2023-06-06 22:23:26');
insert into comment (content, isPublished, comment_timestamp) values ('Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo.', false, '2022-12-28 22:23:08');
insert into comment (content, isPublished, comment_timestamp) values ('Duis mattis egestas metus. Aenean fermentum. Donec ut mauris eget massa tempor convallis.', false, '2023-07-03 08:03:23');
insert into comment (content, isPublished, comment_timestamp) values ('Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.', true, '2023-01-01 18:02:35');
insert into comment (content, isPublished, comment_timestamp) values ('Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh. Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.', false, '2023-05-30 21:48:29');
insert into comment (content, isPublished, comment_timestamp) values ('In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', false, '2022-11-09 04:32:49');
insert into comment (content, isPublished, comment_timestamp) values ('Vivamus tortor.', false, '2023-02-19 15:38:01');

insert into messenger (content, message_timestamp) values ('In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', '2023-06-14 03:02:05');
insert into messenger (content, message_timestamp) values ('Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.

Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', '2022-08-05 11:46:29');
insert into messenger (content, message_timestamp) values ('Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', '2023-01-26 12:02:22');
insert into messenger (content, message_timestamp) values ('In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.

Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.', '2023-04-30 18:22:25');
insert into messenger (content, message_timestamp) values ('Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.

Fusce consequat. Nulla nisl. Nunc nisl.', '2022-07-29 14:04:06');
insert into messenger (content, message_timestamp) values ('Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', '2022-10-10 02:11:55');
insert into messenger (content, message_timestamp) values ('In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', '2022-12-12 01:18:30');
insert into messenger (content, message_timestamp) values ('Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.

Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.', '2022-10-18 15:43:06');
insert into messenger (content, message_timestamp) values ('Phasellus in felis. Donec semper sapien a libero. Nam dui.', '2023-03-10 05:58:13');
insert into messenger (content, message_timestamp) values ('Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', '2023-05-07 00:28:33');
insert into messenger (content, message_timestamp) values ('Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.', '2023-05-23 23:00:58');
insert into messenger (content, message_timestamp) values ('Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', '2023-02-18 05:07:09');
insert into messenger (content, message_timestamp) values ('Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.', '2022-09-03 23:14:48');
insert into messenger (content, message_timestamp) values ('Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', '2022-11-22 07:23:35');
insert into messenger (content, message_timestamp) values ('Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.

Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.', '2022-09-05 10:56:07');
insert into messenger (content, message_timestamp) values ('Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.', '2023-01-22 03:19:10');
insert into messenger (content, message_timestamp) values ('Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.', '2023-06-15 02:08:29');
insert into messenger (content, message_timestamp) values ('Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', '2023-01-12 12:13:58');
insert into messenger (content, message_timestamp) values ('Sed ante. Vivamus tortor. Duis mattis egestas metus.', '2023-06-19 12:47:03');
insert into messenger (content, message_timestamp) values ('Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.

Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', '2022-12-22 16:20:17');
