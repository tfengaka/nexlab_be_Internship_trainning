CREATE TABLE "public"."otp_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "student_email" text NOT NULL,
  "expired_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("student_email") REFERENCES "public"."student"("email") ON UPDATE restrict ON DELETE restrict,
  UNIQUE ("code")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;