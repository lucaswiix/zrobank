
-- +migrate Up
SET SCHEMA 'public';
CREATE TABLE property (
  key BIGSERIAL PRIMARY KEY,
  customer_key BIGSERIAL NOT NULL CONSTRAINT property_customer_fk REFERENCES customer,
  title VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);

-- +migrate Down
SET SCHEMA 'public';
DROP TABLE property;