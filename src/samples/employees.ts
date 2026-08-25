import { SampleQuery } from './types';

export const employeesSamples: SampleQuery[] = [
  {
    "id": "employees-1",
    "name": "Department Salary Averages",
    "description": "Calculates average salary and staff headcounts by department.",
    "sql": "SELECT\n    d.dept_name,\n    COUNT(DISTINCT de.emp_no) AS total_employees,\n    ROUND(AVG(s.salary), 2) AS avg_salary,\n    MAX(s.salary) AS peak_salary\nFROM departments d\nINNER JOIN dept_emp de ON d.dept_no = de.dept_no\nINNER JOIN salaries s ON de.emp_no = s.emp_no\nGROUP BY d.dept_no, d.dept_name\nORDER BY avg_salary DESC;"
  },
  {
    "id": "employees-2",
    "name": "Manager Leadership Tenure",
    "description": "Retrieves department manager names, departments, and tenure dates.",
    "sql": "SELECT\n    d.dept_name,\n    e.first_name || ' ' || e.last_name AS manager_name,\n    dm.from_date,\n    dm.to_date\nFROM dept_manager dm\nINNER JOIN departments d ON dm.dept_no = d.dept_no\nINNER JOIN employees e ON dm.emp_no = e.emp_no\nORDER BY d.dept_name, dm.from_date;"
  },
  {
    "id": "employees-3",
    "name": "Above Average Earners",
    "description": "Finds employees whose salary exceeds overall corporate average.",
    "sql": "SELECT\n    e.emp_no,\n    e.first_name,\n    e.last_name,\n    t.title,\n    s.salary\nFROM employees e\nINNER JOIN titles t ON e.emp_no = t.emp_no\nINNER JOIN salaries s ON e.emp_no = s.emp_no\nWHERE s.salary > (\n    SELECT AVG(salary) FROM salaries\n)\nORDER BY s.salary DESC\nLIMIT 20;"
  },
  {
    "id": "employees-4",
    "name": "Department Salary Tiers CTE",
    "description": "Classifies departments by compensation tiers using Common Table Expressions.",
    "sql": "WITH dept_comp AS (\n    SELECT\n        d.dept_name,\n        AVG(s.salary) AS avg_sal,\n        COUNT(DISTINCT de.emp_no) AS headcount\n    FROM departments d\n    INNER JOIN dept_emp de ON d.dept_no = de.dept_no\n    INNER JOIN salaries s ON de.emp_no = s.emp_no\n    GROUP BY d.dept_no, d.dept_name\n)\nSELECT\n    dept_name,\n    ROUND(avg_sal, 2) AS avg_salary,\n    headcount,\n    CASE\n        WHEN avg_sal > 65000 THEN 'Tier 1 Compensation'\n        ELSE 'Tier 2 Compensation'\n    END AS compensation_tier\nFROM dept_comp\nORDER BY avg_salary DESC;"
  },
  {
    "id": "employees-5",
    "name": "Salary Ranking in Department",
    "description": "Ranks employee salaries within each department using DENSE_RANK().",
    "sql": "SELECT\n    de.dept_no,\n    e.first_name || ' ' || e.last_name AS employee_name,\n    s.salary,\n    DENSE_RANK() OVER (PARTITION BY de.dept_no ORDER BY s.salary DESC) AS dept_salary_rank\nFROM dept_emp de\nINNER JOIN employees e ON de.emp_no = e.emp_no\nINNER JOIN salaries s ON de.emp_no = s.emp_no\nLIMIT 30;"
  },
  {
    "id": "employees-6",
    "name": "Title Distribution and Headcounts",
    "description": "Summarizes employee counts across job titles.",
    "sql": "SELECT\n    title,\n    COUNT(emp_no) AS employee_count,\n    MIN(from_date) AS earliest_appointed\nFROM titles\nGROUP BY title\nORDER BY employee_count DESC;"
  },
  {
    "id": "employees-7",
    "name": "Running Salary Expenditure",
    "description": "Computes cumulative salary expenditure across employee records.",
    "sql": "SELECT\n    emp_no,\n    from_date,\n    salary,\n    SUM(salary) OVER (ORDER BY from_date, emp_no ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_payroll\nFROM salaries\nLIMIT 25;"
  },
  {
    "id": "employees-8",
    "name": "Insert New Employee (Add Data)",
    "description": "Inserts a new staff member record.",
    "sql": "INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date)\nVALUES (99901, '1992-04-15', 'Alex', 'Morgan', 'F', '2024-01-10');"
  },
  {
    "id": "employees-9",
    "name": "Update Department Manager (Modify Data)",
    "description": "Updates end date for department management role.",
    "sql": "UPDATE dept_manager\nSET to_date = '9999-01-01'\nWHERE dept_no = 'd001' AND emp_no = 110022;"
  },
  {
    "id": "employees-10",
    "name": "Delete Test Employee (Remove Data)",
    "description": "Removes the test employee record.",
    "sql": "DELETE FROM employees\nWHERE emp_no = 99901;"
  }
];
