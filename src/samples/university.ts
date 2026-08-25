import { SampleQuery } from './types';

export const universitySamples: SampleQuery[] = [
  {
    "id": "university-1",
    "name": "Department Course Offerings & Budgets",
    "description": "Calculates course counts and budget metrics by academic department.",
    "sql": "SELECT\n    d.dept_name,\n    d.building,\n    d.budget,\n    COUNT(c.course_id) AS total_courses,\n    SUM(c.credits) AS total_department_credits\nFROM departments d\nLEFT JOIN courses c ON d.dept_id = c.dept_id\nGROUP BY d.dept_id, d.dept_name, d.building, d.budget\nORDER BY d.budget DESC;"
  },
  {
    "id": "university-2",
    "name": "Instructor Teaching Loads",
    "description": "Lists instructor salaries and assigned courses.",
    "sql": "SELECT\n    i.first_name || ' ' || i.last_name AS instructor_name,\n    d.dept_name,\n    i.salary,\n    COUNT(c.course_id) AS courses_taught\nFROM instructors i\nINNER JOIN departments d ON i.dept_id = d.dept_id\nLEFT JOIN courses c ON i.instructor_id = c.instructor_id\nGROUP BY i.instructor_id, i.first_name, i.last_name, d.dept_name, i.salary\nORDER BY courses_taught DESC, i.salary DESC;"
  },
  {
    "id": "university-3",
    "name": "High Credit Earners Above Average",
    "description": "Finds students whose credit progress exceeds university average.",
    "sql": "SELECT\n    student_id,\n    first_name,\n    last_name,\n    major,\n    total_credits\nFROM students\nWHERE total_credits > (\n    SELECT AVG(total_credits) FROM students\n)\nORDER BY total_credits DESC;"
  },
  {
    "id": "university-4",
    "name": "Major Enrollment Statistics CTE",
    "description": "Summarizes student count and academic progress by major.",
    "sql": "WITH major_summary AS (\n    SELECT\n        major,\n        COUNT(student_id) AS student_count,\n        AVG(total_credits) AS avg_credits\n    FROM students\n    GROUP BY major\n)\nSELECT\n    major,\n    student_count,\n    ROUND(avg_credits, 1) AS avg_earned_credits\nFROM major_summary\nORDER BY student_count DESC;"
  },
  {
    "id": "university-5",
    "name": "Instructor Salary Rank in Department",
    "description": "Ranks faculty salaries within each academic department.",
    "sql": "SELECT\n    d.dept_name,\n    i.last_name,\n    i.salary,\n    RANK() OVER (PARTITION BY i.dept_id ORDER BY i.salary DESC) AS salary_rank\nFROM instructors i\nINNER JOIN departments d ON i.dept_id = d.dept_id\nLIMIT 25;"
  },
  {
    "id": "university-6",
    "name": "Course Enrollment Roster Counts",
    "description": "Summarizes student enrollments across active course codes.",
    "sql": "SELECT\n    c.course_code,\n    c.title,\n    c.credits,\n    COUNT(e.enrollment_id) AS enrolled_students\nFROM courses c\nLEFT JOIN enrollments e ON c.course_id = e.course_id\nGROUP BY c.course_id, c.course_code, c.title, c.credits\nORDER BY enrolled_students DESC;"
  },
  {
    "id": "university-7",
    "name": "Cumulative Faculty Payroll by Dept",
    "description": "Calculates running salary totals for instructors across departments.",
    "sql": "SELECT\n    dept_id,\n    instructor_id,\n    salary,\n    SUM(salary) OVER (PARTITION BY dept_id ORDER BY instructor_id) AS cumulative_dept_salary\nFROM instructors\nLIMIT 25;"
  },
  {
    "id": "university-8",
    "name": "Insert New Student (Add Data)",
    "description": "Enrolls a new undergraduate student.",
    "sql": "INSERT INTO students (student_id, first_name, last_name, major, total_credits)\nVALUES (9901, 'Samantha', 'Reed', 'Computer Science', 48);"
  },
  {
    "id": "university-9",
    "name": "Update Department Budget (Modify Data)",
    "description": "Allocates increased research grant funding to Engineering.",
    "sql": "UPDATE departments\nSET budget = budget * 1.10\nWHERE dept_name = 'Engineering';"
  },
  {
    "id": "university-10",
    "name": "Delete Test Student (Remove Data)",
    "description": "Removes the test student enrollment profile.",
    "sql": "DELETE FROM students\nWHERE student_id = 9901;"
  }
];
