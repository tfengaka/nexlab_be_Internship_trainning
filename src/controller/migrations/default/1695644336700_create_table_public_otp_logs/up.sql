CREATE TABLE "public"."otp_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "code" text NOT NULL,
  "email" text NOT NULL,
  "expired_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  UNIQUE ("code"),
  FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON UPDATE restrict ON DELETE restrict
);
