CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	surname VARCHAR(50) NOT NULL,
	phone_number VARCHAR(17) NOT NULL,
	email VARCHAR(320) NOT NULL UNIQUE,
	password VARCHAR(32) NOT NULL,
);

CREATE TYPE answer_types AS ENUM ('single line text', 'multiline text', 'radio button', 'checkbox', 'combobox', 'date');

CREATE TABLE conversations (
	id SERIAL PRIMARY KEY,
	sender_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
	reciever_id INT REFERENCES users (id) ON DELETE CASCADE,
	question_text VARCHAR(320) NOT NULL,
	answer_type answer_types NOT NULL,
	answer_text VARCHAR(320)
);