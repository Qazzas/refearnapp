BEGIN;

DO $$
BEGIN
  -- SCENARIO A: Old name exists -> Rename it
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='license_keys' AND column_name='license_id') THEN
ALTER TABLE "license_keys" RENAME COLUMN "license_id" TO "polar_id";
RAISE NOTICE 'Renamed license_id to polar_id';

  -- SCENARIO B: Neither exists -> Create fresh
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='license_keys' AND column_name='polar_id') THEN
ALTER TABLE "license_keys" ADD COLUMN "polar_id" text;
RAISE NOTICE 'Created polar_id fresh';

ELSE
    RAISE NOTICE 'polar_id already exists, doing nothing';
END IF;

  -- Ensure the Unique Constraint exists
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'license_keys_polar_id_unique') THEN
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_polar_id_unique" UNIQUE("polar_id");
RAISE NOTICE 'Constraint added';
END IF;

  -- Cleanup old constraint if it somehow still exists
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'license_keys_license_id_unique') THEN
ALTER TABLE "license_keys" DROP CONSTRAINT "license_keys_license_id_unique";
END IF;
END $$;

COMMIT;