CREATE TABLE "public"."users" (
  "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name"   TEXT NOT NULL,
  "email"       TEXT NOT NULL,
  "password"    TEXT NOT NULL,
  "status"      TEXT NOT NULL DEFAULT 'active',
  "verified_at" TIMESTAMPTZ,
  "created_at"  TIMESTAMPTZ DEFAULT now(),
  "updated_at"  TIMESTAMPTZ,
  UNIQUE ("email"),
  PRIMARY KEY ("id")
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"() RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER "set_public_users_updatedAt" BEFORE
UPDATE ON "public"."users" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();