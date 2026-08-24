import { SampleQuery } from './chinook';

export const hospitalSamples: SampleQuery[] = [
  {
    id: 'hosp-1',
    name: 'Patient Admissions and Attending Physicians',
    description: 'Retrieves patient admissions with attending doctor names, room numbers, and departments.',
    sql: `SELECT
    p.first_name || ' ' || p.last_name AS patient_name,
    p.gender,
    d.first_name || ' ' || d.last_name AS doctor_name,
    dept.name AS department,
    a.admission_date,
    a.discharge_date,
    a.room_number
FROM admissions a
INNER JOIN patients p ON a.patient_id = p.patient_id
INNER JOIN doctors d ON a.attending_doctor_id = d.doctor_id
INNER JOIN departments dept ON d.dept_id = dept.dept_id
ORDER BY a.admission_date DESC;`,
  },
  {
    id: 'hosp-2',
    name: 'Department Admissions and Bed Occupancy',
    description: 'Calculates active admissions and bed capacity totals per hospital department.',
    sql: `SELECT
    dept.name AS department,
    dept.head_doctor,
    dept.bed_capacity,
    COUNT(a.admission_id) AS total_admissions,
    SUM(CASE WHEN a.discharge_date IS NULL THEN 1 ELSE 0 END) AS current_inpatients
FROM departments dept
LEFT JOIN doctors d ON dept.dept_id = d.dept_id
LEFT JOIN admissions a ON d.doctor_id = a.attending_doctor_id
GROUP BY dept.dept_id, dept.name, dept.head_doctor, dept.bed_capacity
ORDER BY total_admissions DESC;`,
  },
  {
    id: 'hosp-3',
    name: 'Most Prescribed Medications and Costs CTE',
    description: 'Ranks prescribed medications by dosage frequencies and total pharmacy costs.',
    sql: `WITH medication_costs AS (
    SELECT
        m.name AS medication_name,
        m.category,
        COUNT(pr.prescription_id) AS times_prescribed,
        ROUND(SUM(m.unit_cost * pr.quantity), 2) AS total_cost
    FROM prescriptions pr
    INNER JOIN medications m ON pr.medication_id = m.medication_id
    GROUP BY m.medication_id, m.name, m.category
)
SELECT
    medication_name,
    category,
    times_prescribed,
    total_cost
FROM medication_costs
ORDER BY total_cost DESC;`,
  },
];
