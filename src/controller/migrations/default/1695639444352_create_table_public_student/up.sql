CREATE TABLE "public"."user" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "password" text NOT NULL,
  "status" text NOT NULL DEFAULT '"active"',
  "verified_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("email"),
  UNIQUE ("id")
);