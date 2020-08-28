
-- +migrate Up
SET SCHEMA 'public';
CREATE TABLE customer (
  key BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(50) NOT NULL CONSTRAINT customer_email_uq UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- +migrate Down
SET SCHEMA 'public';
DROP TABLE customer;
