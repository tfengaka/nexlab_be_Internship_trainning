CREATE TABLE "public"."class" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "class_name" text NOT NULL,
  "status" text NOT NULL DEFAULT '"active"',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("id"),
  UNIQUE ("class_name")
);