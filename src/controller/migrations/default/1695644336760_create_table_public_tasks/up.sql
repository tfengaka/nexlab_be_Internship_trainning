CREATE TABLE "public"."tasks" (
  "id"            UUID        DEFAULT gen_random_uuid(),
  "title"         TEXT        NOT NULL,
  "descriptions"  TEXT        NOT NULL,
  "images"        JSONB       DEFAULT jsonb_build_array(),
  "status"        TEXT        DEFAULT 'active',
  "order"         INT         NOT NULL,
  "is_compeleted" BOOLEAN     DEFAULT FALSE,
  "assignee_id"   UUID        NOT NULL,
  "created_at"    TIMESTAMPTZ DEFAULT now(),
  "updated_at"    TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON UPDATE RESTRICT ON DELETE RESTRICT
);
CREATE OR REPLACE TRIGGER "set_public_tasks_updatedAt" BEFORE
UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();

CREATE OR REPLACE FUNCTION "public"."set_order"() RETURNS TRIGGER AS $$
BEGIN
  NEW."order" = (SELECT COUNT(*) FROM "public"."tasks");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER "set_public_task_order" BEFORE
INSERT ON "public"."tasks" FOR EACH ROW EXECUTE PROCEDURE "public"."set_order"();


CREATE VIEW "public"."task_stats" AS
SELECT
  "assignee_id",
  COUNT(*) AS "total_tasks",
  SUM(CASE WHEN "is_compeleted" = TRUE THEN 1 ELSE 0 END) AS "total_completed",
  CAST(SUM(CASE WHEN "is_compeleted" = TRUE THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 AS "completed_percent",
  SUM(CASE WHEN "is_compeleted" = FALSE THEN 1 ELSE 0 END) AS "total_uncompleted",
  CAST(SUM(CASE WHEN "is_compeleted" = FALSE THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 AS "uncompleted_percent"
FROM
  "public"."tasks"
GROUP BY
  "assignee_id";