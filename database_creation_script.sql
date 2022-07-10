CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	surname VARCHAR(50) NOT NULL,
	phone_number VARCHAR(17) NOT NULL,
	email VARCHAR(320) NOT NULL UNIQUE,
	password VARCHAR(32) NOT NULL,
);

CREATE TYPE answer_types AS ENUM ('single line text', 'multiline text', 'radio button', 'checkbox', 'combobox', 'date');

CREATE TABLE answers (
	id SERIAL PRIMARY KEY,
	type answer_types NOT NULL,
	text VARCHAR(320)
);


CREATE OR REPLACE FUNCTION delete_related_answer() RETURNS TRIGGER AS $$
BEGIN
	DELETE FROM answers
	WHERE id=OLD.answer_id;
	RETURN OLD;
END $$ LANGUAGE 'plpgsql';

CREATE TRIGGER conversation_delete
	AFTER DELETE
	ON conversations
	FOR EACH ROW
	EXECUTE PROCEDURE delete_related_answer();


CREATE TABLE conversations (
	id SERIAL PRIMARY KEY,
	sender_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	reciever_id INT REFERENCES users (id) ON DELETE CASCADE,
	question_text VARCHAR(320) NOT NULL,
	answer INT NOT NULL REFERENCES answers (id) ON DELETE CASCADE,
);