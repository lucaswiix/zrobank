
-- +migrate Up
SET SCHEMA 'public';
ALTER TABLE customer ADD COLUMN latitude DOUBLE PRECISION NOT NULL;
ALTER TABLE customer ADD COLUMN longitude DOUBLE PRECISION NOT NULL;



-- +migrate Down
SET SCHEMA 'public';
ALTER TABLE customer DROP COLUMN latitude;
ALTER TABLE customer DROP COLUMN longitude;