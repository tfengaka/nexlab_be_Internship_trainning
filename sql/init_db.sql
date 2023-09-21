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