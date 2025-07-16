export const initTablesSQL = `

DROP TABLE IF EXISTS confessions CASCADE;

CREATE TABLE confessions (
  id SERIAL PRIMARY KEY,
  confession TEXT NOT NULL,
  age INTEGER CHECK (age >= 0),
  sex VARCHAR(10) CHECK (sex IN ('male', 'female')),
  category VARCHAR(300),
  created_at TIMESTAMP DEFAULT NOW()
);


`;
