import { SampleQuery } from './types';

export const hospitalSamples: SampleQuery[] = [
  {
    "id": "hospital-1",
    "name": "Department Bed Occupancy and Staff",
    "description": "Calculates doctor headcounts and capacity metrics by clinical department.",
    "sql": "SELECT\n    dept.name AS department_name,\n    dept.head_doctor,\n    dept.bed_capacity,\n    COUNT(doc.doctor_id) AS assigned_doctors\nFROM departments dept\nLEFT JOIN doctors doc ON dept.dept_id = doc.dept_id\nGROUP BY dept.dept_id, dept.name, dept.head_doctor, dept.bed_capacity\nORDER BY dept.bed_capacity DESC;"
  },
  {
    "id": "hospital-2",
    "name": "Patient Admissions and Diagnoses",
    "description": "Lists patient admission records with attending doctor details.",
    "sql": "SELECT\n    p.first_name || ' ' || p.last_name AS patient_name,\n    p.gender,\n    p.blood_type,\n    adm.admission_date,\n    adm.diagnosis,\n    doc.first_name || ' ' || doc.last_name AS attending_doctor\nFROM admissions adm\nINNER JOIN patients p ON adm.patient_id = p.patient_id\nINNER JOIN doctors doc ON adm.attending_doctor_id = doc.doctor_id\nORDER BY adm.admission_date DESC\nLIMIT 15;"
  },
  {
    "id": "hospital-3",
    "name": "Expensive Medication Prescriptions",
    "description": "Finds prescribed medications with unit costs above pharmaceutical average.",
    "sql": "SELECT\n    m.name AS medication_name,\n    m.category,\n    m.unit_cost,\n    pr.dosage,\n    pr.quantity\nFROM prescriptions pr\nINNER JOIN medications m ON pr.medication_id = m.medication_id\nWHERE m.unit_cost > (SELECT AVG(unit_cost) FROM medications)\nORDER BY m.unit_cost DESC;"
  },
  {
    "id": "hospital-4",
    "name": "Doctor Patient Load CTE",
    "description": "Aggregates patient admission caseloads per attending physician.",
    "sql": "WITH doctor_caseload AS (\n    SELECT\n        d.doctor_id,\n        d.first_name || ' ' || d.last_name AS doctor_name,\n        d.specialty,\n        COUNT(a.admission_id) AS total_patients\n    FROM doctors d\n    LEFT JOIN admissions a ON d.doctor_id = a.attending_doctor_id\n    GROUP BY d.doctor_id, d.first_name, d.last_name, d.specialty\n)\nSELECT\n    doctor_name,\n    specialty,\n    total_patients\nFROM doctor_caseload\nORDER BY total_patients DESC;"
  },
  {
    "id": "hospital-5",
    "name": "Doctor Patient Ranking by Specialty",
    "description": "Ranks physicians by total admission count within their specialty.",
    "sql": "SELECT\n    specialty,\n    first_name || ' ' || last_name AS doctor_name,\n    COUNT(a.admission_id) AS patient_count,\n    RANK() OVER (PARTITION BY specialty ORDER BY COUNT(a.admission_id) DESC) AS specialty_rank\nFROM doctors d\nLEFT JOIN admissions a ON d.doctor_id = a.attending_doctor_id\nGROUP BY d.doctor_id, specialty, first_name, last_name\nLIMIT 25;"
  },
  {
    "id": "hospital-6",
    "name": "Medication Category Cost Summary",
    "description": "Summarizes pharmaceutical inventory unit costs across categories.",
    "sql": "SELECT\n    category,\n    COUNT(medication_id) AS drug_count,\n    ROUND(AVG(unit_cost), 2) AS avg_unit_cost,\n    MAX(unit_cost) AS max_unit_cost\nFROM medications\nGROUP BY category\nORDER BY avg_unit_cost DESC;"
  },
  {
    "id": "hospital-7",
    "name": "Cumulative Prescription Costs",
    "description": "Calculates running expenditure on prescribed medications.",
    "sql": "SELECT\n    prescription_id,\n    admission_id,\n    quantity,\n    SUM(quantity) OVER (PARTITION BY admission_id ORDER BY prescription_id) AS running_quantity\nFROM prescriptions\nLIMIT 25;"
  },
  {
    "id": "hospital-8",
    "name": "Insert New Patient (Add Data)",
    "description": "Registers a new clinical patient intake record.",
    "sql": "INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, gender, blood_type)\nVALUES (9901, 'Elena', 'Rostova', '1988-06-21', 'F', 'O+');"
  },
  {
    "id": "hospital-9",
    "name": "Update Bed Capacity (Modify Data)",
    "description": "Increases capacity for Intensive Care Unit.",
    "sql": "UPDATE departments\nSET bed_capacity = bed_capacity + 10\nWHERE name = 'Intensive Care';"
  },
  {
    "id": "hospital-10",
    "name": "Delete Test Patient (Remove Data)",
    "description": "Removes the test patient record.",
    "sql": "DELETE FROM patients\nWHERE patient_id = 9901;"
  }
];
