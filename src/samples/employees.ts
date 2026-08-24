import { SampleQuery } from './chinook';

export const employeesSamples: SampleQuery[] = [
  {
    id: 'employees-1',
    name: 'Current Salary by Department',
    description: 'Finds employee salaries grouped by department name.',
    sql: `SELECT
    d.dept_name,
    e.first_name || ' ' || e.last_name AS employee_name,
    t.title,
    s.salary
FROM employees e
INNER JOIN dept_emp de ON e.emp_no = de.emp_no
INNER JOIN departments d ON de.dept_no = d.dept_no
INNER JOIN titles t ON e.emp_no = t.emp_no
INNER JOIN salaries s ON e.emp_no = s.emp_no
ORDER BY s.salary DESC;`,
  },
  {
    id: 'employees-2',
    name: 'Department Average Salary CTE',
    description: 'Computes department salary statistics and employee counts using a Common Table Expression.',
    sql: `WITH dept_salaries AS (
    SELECT
        d.dept_no,
        d.dept_name,
        COUNT(e.emp_no) AS head_count,
        ROUND(AVG(s.salary), 2) AS avg_salary,
        MAX(s.salary) AS max_salary
    FROM departments d
    INNER JOIN dept_emp de ON d.dept_no = de.dept_no
    INNER JOIN employees e ON de.emp_no = e.emp_no
    INNER JOIN salaries s ON e.emp_no = s.emp_no
    GROUP BY d.dept_no, d.dept_name
)
SELECT
    dept_name,
    head_count,
    avg_salary,
    max_salary
FROM dept_salaries
ORDER BY avg_salary DESC;`,
  },
  {
    id: 'employees-3',
    name: 'Department Managers and Department Names',
    description: 'Lists department managers and their hire dates.',
    sql: `SELECT
    d.dept_name,
    e.first_name || ' ' || e.last_name AS manager_name,
    e.hire_date,
    dm.from_date AS manager_since
FROM departments d
INNER JOIN dept_manager dm ON d.dept_no = dm.dept_no
INNER JOIN employees e ON dm.emp_no = e.emp_no
ORDER BY d.dept_name ASC;`,
  },
];
