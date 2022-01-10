DROP TABLE IF EXISTS todos CASCADE;
CREATE TABLE todos (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER DEFAULT 5 REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL
);
