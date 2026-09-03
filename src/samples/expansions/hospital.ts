import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const hospitalExpansion: SampleQuery[] = [
  sample('hospital-11', 'Length of Stay by Diagnosis', 'Compares average hospital stay and current cases by diagnosis.', `SELECT diagnosis, COUNT(*) AS admissions,
       ROUND(AVG(julianday(COALESCE(discharge_date, date('now'))) - julianday(admission_date)), 1) AS avg_stay_days,
       SUM(CASE WHEN discharge_date IS NULL THEN 1 ELSE 0 END) AS current_patients
FROM admissions
GROUP BY diagnosis
ORDER BY avg_stay_days DESC;`),
    sample('hospital-12', 'Medication Cost by Department', 'Estimates prescribed medication cost for each hospital department.', `SELECT d.name AS department,
       ROUND(SUM(p.quantity * m.unit_cost), 2) AS medication_cost,
       COUNT(DISTINCT p.prescription_id) AS prescriptions
FROM prescriptions p
JOIN medications m ON p.medication_id = m.medication_id
JOIN admissions a ON p.admission_id = a.admission_id
JOIN doctors doc ON a.attending_doctor_id = doc.doctor_id
JOIN departments d ON doc.dept_id = d.dept_id
GROUP BY d.dept_id, d.name
ORDER BY medication_cost DESC;`),
    sample('hospital-13', 'Department Bed Load', 'Compares current admissions with the stated bed capacity of each department.', `SELECT d.name, d.bed_capacity,
       SUM(CASE WHEN a.discharge_date IS NULL THEN 1 ELSE 0 END) AS occupied_beds,
       ROUND(100.0 * SUM(CASE WHEN a.discharge_date IS NULL THEN 1 ELSE 0 END) / d.bed_capacity, 1) AS occupancy_pct
FROM departments d
LEFT JOIN doctors doc ON d.dept_id = doc.dept_id
LEFT JOIN admissions a ON doc.doctor_id = a.attending_doctor_id
GROUP BY d.dept_id, d.name, d.bed_capacity
ORDER BY occupancy_pct DESC;`),
    ...profileSamples({ key: 'hospital', table: 'medications', subject: 'medications', value: 'unit_cost', valueLabel: 'Unit Costs', category: 'category', categoryLabel: 'Medication Category', id: 'medication_id' })
];
