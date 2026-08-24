import { SampleQuery } from './chinook';

export const universitySamples: SampleQuery[] = [
  {
    id: 'uni-1',
    name: 'Course Offerings and Department Instructors',
    description: 'Lists course offerings with department and instructor assignments.',
    sql: `SELECT
    c.course_code,
    c.title AS course_title,
    d.dept_name,
    i.first_name || ' ' || i.last_name AS instructor_name,
    c.credits
FROM courses c
INNER JOIN departments d ON c.dept_id = d.dept_id
INNER JOIN instructors i ON c.instructor_id = i.instructor_id
ORDER BY d.dept_name ASC, c.course_code ASC;`,
  },
  {
    id: 'uni-2',
    name: 'Student Transcript and Completed Credits',
    description: 'Aggregates enrolled courses and grades for students.',
    sql: `SELECT
    s.student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    s.major,
    COUNT(e.enrollment_id) AS courses_taken,
    SUM(c.credits) AS total_credits_earned
FROM students s
INNER JOIN enrollments e ON s.student_id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE e.grade NOT IN ('F', 'W')
GROUP BY s.student_id, s.first_name, s.last_name, s.major
ORDER BY total_credits_earned DESC;`,
  },
  {
    id: 'uni-3',
    name: 'Course Enrollment Roster CTE',
    description: 'Calculates student enrollment headcounts per department and section.',
    sql: `WITH class_sizes AS (
    SELECT
        course_id,
        COUNT(student_id) AS enrolled_students
    FROM enrollments
    GROUP BY course_id
)
SELECT
    c.course_code,
    c.title,
    d.dept_name,
    COALESCE(cs.enrolled_students, 0) AS student_count
FROM courses c
INNER JOIN departments d ON c.dept_id = d.dept_id
LEFT JOIN class_sizes cs ON c.course_id = cs.course_id
ORDER BY student_count DESC;`,
  },
];
