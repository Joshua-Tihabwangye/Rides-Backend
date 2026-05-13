-- Adds expiry metadata required by onboarding and order access checks.
-- Assumes PostgreSQL.

ALTER TABLE driver_documents
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(64),
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS expiry_date DATE;

-- If legacy rows exist, backfill before enforcing NOT NULL in a later migration.
CREATE INDEX IF NOT EXISTS idx_driver_documents_driver_type
  ON driver_documents (driver_id, document_type);

CREATE INDEX IF NOT EXISTS idx_driver_documents_expiry_date
  ON driver_documents (expiry_date);
