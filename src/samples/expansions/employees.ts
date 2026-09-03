import { SampleQuery } from '../types';
import { sample } from './helpers';

export const employeesExpansion: SampleQuery[] = [
  sample('employees-11', 'Current Department Roster', 'Lists each employee with the department on their latest assignment.', `WITH ranked_assignments AS (
    SELECT de.*, ROW_NUMBER() OVER (PARTITION BY emp_no ORDER BY to_date DESC) AS recency
    FROM dept_emp de
)
SELECT e.emp_no, e.first_name, e.last_name, d.dept_name
FROM ranked_assignments ra
JOIN employees e ON ra.emp_no = e.emp_no
JOIN departments d ON ra.dept_no = d.dept_no
WHERE ra.recency = 1
ORDER BY d.dept_name, e.last_name;`),
    sample('employees-12', 'Largest Salary Jumps', 'Compares consecutive salary records to find the biggest raises.', `WITH salary_history AS (
    SELECT emp_no, from_date, salary,
           LAG(salary) OVER (PARTITION BY emp_no ORDER BY from_date) AS prior_salary
    FROM salaries
)
SELECT emp_no, from_date, prior_salary, salary, salary - prior_salary AS raise_amount
FROM salary_history
WHERE prior_salary IS NOT NULL
ORDER BY raise_amount DESC
LIMIT 20;`),
    sample('employees-13', 'Career Title Variety', 'Finds employees who have held the widest range of job titles.', `SELECT e.emp_no, e.first_name, e.last_name, COUNT(DISTINCT t.title) AS titles_held
FROM employees e
JOIN titles t ON e.emp_no = t.emp_no
GROUP BY e.emp_no, e.first_name, e.last_name
ORDER BY titles_held DESC, e.last_name
LIMIT 20;`),
    sample('employees-14', 'Department Salary Levels', 'Compares average recorded salaries across departments.', `SELECT d.dept_name, ROUND(AVG(s.salary), 0) AS avg_salary, MIN(s.salary) AS min_salary, MAX(s.salary) AS max_salary FROM departments d JOIN dept_emp de ON d.dept_no = de.dept_no JOIN salaries s ON de.emp_no = s.emp_no GROUP BY d.dept_no, d.dept_name ORDER BY avg_salary DESC;`),
    sample('employees-15', 'Manager Tenure', 'Calculates the length of each department manager assignment.', `SELECT d.dept_name, e.first_name || ' ' || e.last_name AS manager, dm.from_date, dm.to_date, CAST(julianday(dm.to_date) - julianday(dm.from_date) AS INTEGER) AS tenure_days FROM dept_manager dm JOIN departments d ON dm.dept_no = d.dept_no JOIN employees e ON dm.emp_no = e.emp_no ORDER BY tenure_days DESC;`),
    sample('employees-16', 'Hiring Cohorts', 'Counts employees by hiring year and gender.', `SELECT substr(hire_date, 1, 4) AS hire_year, gender, COUNT(*) AS hires FROM employees GROUP BY hire_year, gender ORDER BY hire_year, gender;`),
    sample('employees-17', 'Salary History Depth', 'Finds employees with the most recorded salary changes.', `SELECT e.emp_no, e.first_name, e.last_name, COUNT(s.from_date) AS salary_records, MAX(s.salary) - MIN(s.salary) AS salary_range FROM employees e JOIN salaries s ON e.emp_no = s.emp_no GROUP BY e.emp_no, e.first_name, e.last_name ORDER BY salary_records DESC, salary_range DESC;`),
    sample('employees-18', 'Department Transfers', 'Lists employees who have worked in more than one department.', `SELECT e.emp_no, e.first_name, e.last_name, COUNT(DISTINCT de.dept_no) AS departments_worked FROM employees e JOIN dept_emp de ON e.emp_no = de.emp_no GROUP BY e.emp_no, e.first_name, e.last_name HAVING COUNT(DISTINCT de.dept_no) > 1 ORDER BY departments_worked DESC;`),
    sample('employees-19', 'Title Pay Comparison', 'Compares salary levels associated with each job title.', `SELECT t.title, COUNT(DISTINCT t.emp_no) AS employees, ROUND(AVG(s.salary), 0) AS avg_salary FROM titles t JOIN salaries s ON t.emp_no = s.emp_no AND s.from_date <= COALESCE(t.to_date, '9999-12-31') AND s.to_date >= t.from_date GROUP BY t.title ORDER BY avg_salary DESC;`),
    sample('employees-20', 'Age at Hire', 'Groups employees by the age when they joined the company.', `SELECT CASE WHEN julianday(hire_date) - julianday(birth_date) < 25 * 365.25 THEN 'Under 25' WHEN julianday(hire_date) - julianday(birth_date) < 35 * 365.25 THEN '25 to 34' ELSE '35 and older' END AS age_group, COUNT(*) AS employees FROM employees GROUP BY age_group ORDER BY employees DESC;`),
];
