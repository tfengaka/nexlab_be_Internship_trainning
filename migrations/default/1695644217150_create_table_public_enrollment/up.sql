CREATE TABLE "public"."enrollment" (
  "student_id" uuid NOT NULL,
  "class_id" uuid NOT NULL,
  "status" text NOT NULL DEFAULT '"active"',
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("student_id", "class_id"),
  FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON UPDATE restrict ON DELETE restrict
);