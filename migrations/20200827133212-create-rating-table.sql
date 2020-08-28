
-- +migrate Up
SET SCHEMA 'public';
CREATE TABLE rating (
  key BIGSERIAL PRIMARY KEY,
  property_key BIGSERIAL NOT NULL CONSTRAINT rating_property_fk REFERENCES property,
  rating SMALLINT NOT NULL,
  description TEXT,
  customer_key  BIGSERIAL NOT NULL CONSTRAINT rating_customer_fk REFERENCES customer,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- GRANT SELECT, UPDATE, DELETE, INSERT ON rating TO zrobank;
-- GRANT USAGE, SELECT ON rating_key_seq TO zrobank;

-- +migrate Down
SET SCHEMA 'public';
DROP TABLE rating;