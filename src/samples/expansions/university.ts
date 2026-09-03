import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const universityExpansion: SampleQuery[] = [
  sample('university-11', 'Grade Mix by Department', 'Shows the grade distribution for courses in each department.', `SELECT d.dept_name, e.grade, COUNT(*) AS students
FROM enrollments e
JOIN courses c ON e.course_id = c.course_id
JOIN departments d ON c.dept_id = d.dept_id
GROUP BY d.dept_id, d.dept_name, e.grade
ORDER BY d.dept_name, students DESC;`),
    sample('university-12', 'Courses Waiting for Enrollment', 'Finds catalog courses with no student enrollments.', `SELECT c.course_code, c.title, d.dept_name, c.credits
FROM courses c
JOIN departments d ON c.dept_id = d.dept_id
LEFT JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_code, c.title, d.dept_name, c.credits
HAVING COUNT(e.enrollment_id) = 0
ORDER BY d.dept_name, c.course_code;`),
    sample('university-13', 'Budget per Active Course', 'Compares departmental budgets after adjusting for course count.', `SELECT d.dept_name, d.budget, COUNT(c.course_id) AS course_count,
       ROUND(d.budget / NULLIF(COUNT(c.course_id), 0), 2) AS budget_per_course
FROM departments d
LEFT JOIN courses c ON d.dept_id = c.dept_id
GROUP BY d.dept_id, d.dept_name, d.budget
ORDER BY budget_per_course DESC;`),
    ...profileSamples({ key: 'university', table: 'students', subject: 'students', value: 'total_credits', valueLabel: 'Credits', category: 'major', categoryLabel: 'Major', id: 'student_id' })
];
