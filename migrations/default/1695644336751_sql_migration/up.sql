-- VIEW: student_stats
CREATE OR REPLACE VIEW student_stats AS
SELECT student."id" AS student_id,
  student."full_name" AS student_name,
  COUNT(DISTINCT enrollment."class_id") AS register_class_count,
  (
    SELECT COUNT(*)
    FROM class
  ) - COUNT(DISTINCT enrollment."class_id") AS unregister_class_count
FROM student
  LEFT JOIN enrollment ON student."id" = enrollment."student_id"
GROUP BY student."id";
-- Function: student_search
CREATE INDEX idx_student_name ON student(full_name);
CREATE TABLE student_search_result(student_id uuid, student_name text);
CREATE OR REPLACE FUNCTION search_student(search_text text) RETURNS SETOF student_search_result AS $$ BEGIN RETURN QUERY
SELECT student."id" as student_id,
  student."full_name" as student_name
FROM student
WHERE student."full_name" ILIKE '%' || search_text || '%';
END;
$$ LANGUAGE plpgsql stable;
-- Trigger: before_insert_enrollment
CREATE OR REPLACE FUNCTION before_insert_enrollment() RETURNS TRIGGER as $$ BEGIN NEW.expired_at := (CURRENT_DATE + INTERVAL '7 days')::DATE;
NEW.expired_at := DATE_TRUNC('day', NEW.expired_at) + INTERVAL '1 day' - INTERVAL '7 hours' - INTERVAL '1 second';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER before_insert_enrollment BEFORE
INSERT ON enrollment FOR EACH ROW EXECUTE FUNCTION before_insert_enrollment();