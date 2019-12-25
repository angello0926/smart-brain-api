BEGIN TRANSACTION;

INSERT into users (name, email, password, entries, joined) values ('Tim', 'anc@fdsf.com', '$2a$10$/kf4l1YiA6GNp64EXYnUs.UzJhiX1B1V0VBtjgOw5ByfpRtFDE1Ea', '5', '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$/kf4l1YiA6GNp64EXYnUs.UzJhiX1B1V0VBtjgOw5ByfpRtFDE1Ea', 'anc@fdsf.com');

COMMIT;