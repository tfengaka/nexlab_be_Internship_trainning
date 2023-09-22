-- 5 / create view(file.sql) student_stats(student_id, register_class_count, unregister_class_count) --
CREATE VIEW student_stats AS
	SELECT
			students."id" AS student_id,
			students."fullName" AS student_name,
			COUNT(DISTINCT enrollments."classId") AS register_class_count,
			(SELECT COUNT(*) FROM classes) - COUNT(DISTINCT enrollments."classId") AS unregister_class_count
	FROM students
	LEFT JOIN enrollments ON students."id" = enrollments."studentId"
	GROUP BY students."id";

-- 6/ create function (file.sql) search_student
CREATE OR REPLACE FUNCTION search_student(search_text TEXT) 
RETURNS TABLE (student_id UUID, student_name TEXT) AS $Students$
BEGIN
    RETURN QUERY
    SELECT students."id" as student_id, students."fullName" as student_name
    FROM students
    WHERE students."fullName" ILIKE '%' || search_text || '%';
END;
$Students$ LANGUAGE plpgsql;