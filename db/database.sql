-- psql -U postgres
-- \l : show all databases
-- createdb {database_name}
-- \c {database_name} : connect to db
-- \dt : show tables
-- \d {table_name} : describe a table schema
-- SELECT * from {table_name};

CREATE DATABASE todolist;

CREATE TABLE list(
    list_id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_app(user_id)
);

CREATE TABLE user_app(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE todo(
    list_id INT,
    description VARCHAR(255),
    completed BOOLEAN,
    due_date DATE,
    PRIMARY KEY (list_id),
    FOREIGN KEY(list_id) REFERENCES list(list_id) ON DELETE CASCADE
);

ALTER TABLE list ADD user_id INT;
ALTER TABLE todo ADD list_id INT;
ALTER TABLE todo ADD user_id INT;
ALTER TABLE todo ADD completed BOOLEAN DEFAULT false;
ALTER TABLE todo ADD due_date DATE;
ALTER TABLE todo DROP COLUMN completed;
