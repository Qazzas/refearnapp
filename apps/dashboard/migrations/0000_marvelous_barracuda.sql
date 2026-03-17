-- migration_rename_license_id_to_polar_id.sql

BEGIN;

DO $$
BEGIN
  -- 1. Rename column ONLY if the old name exists
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name='license_keys' AND column_name='license_id') THEN
ALTER TABLE "license_keys" RENAME COLUMN "license_id" TO "polar_id";
RAISE NOTICE 'Column license_id renamed to polar_id';
ELSE
    RAISE NOTICE 'Column license_id does not exist, skipping rename';
END IF;

  -- 2. Drop the old constraint if it exists
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'license_keys_license_id_unique') THEN
ALTER TABLE "license_keys" DROP CONSTRAINT "license_keys_license_id_unique";
RAISE NOTICE 'Dropped old constraint license_keys_license_id_unique';
END IF;

  -- 3. Add the new constraint ONLY if it doesn't exist yet
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'license_keys_polar_id_unique') THEN
    -- Ensure the column exists before trying to add a constraint to it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='license_keys' AND column_name='polar_id') THEN
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_polar_id_unique" UNIQUE("polar_id");
RAISE NOTICE 'Added new unique constraint on polar_id';
END IF;
END IF;
END $$;

COMMIT;