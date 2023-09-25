-- 5 / create view(file.sql) student_stats(student_id, register_class_count, unregister_class_count) --
CREATE OR REPLACE VIEW student_stats AS
	SELECT
			student."id" AS student_id,
			student."full_name" AS student_name,
			COUNT(DISTINCT enrollment."class_id") AS register_class_count,
			(SELECT COUNT(*) FROM class) - COUNT(DISTINCT enrollment."class_id") AS unregister_class_count
	FROM student
	LEFT JOIN enrollment ON student."id" = enrollment."student_id"
	GROUP BY student."id";

-- 6/ create function (file.sql) search_student
CREATE INDEX idx_student_id ON student(id);
CREATE TABLE student_search_result(student_id uuid, student_name text);
CREATE OR REPLACE FUNCTION search_student(search_text text)
  RETURNS SETOF student_search_result AS $$
BEGIN
    RETURN QUERY
    SELECT student."id" as student_id, student."full_name" as student_name
    FROM student
    WHERE student."full_name" ILIKE '%' || search_text || '%';
END;
$$ LANGUAGE plpgsql;