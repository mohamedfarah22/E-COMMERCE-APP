DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL
);
-- create dummy user data-- 
INSERT INTO users(first_name, last_name, email, password)
VALUES ('Mohamed', 'Farah', 'mohamed.farah9810@gmail.com', 'password');

INSERT INTO users(first_name, last_name, email, password)
VALUES ('Mustafa', 'Farah', 'mustafa.farah@gmail.com', 'password');