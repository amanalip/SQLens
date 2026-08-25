import { SampleQuery } from './types';

export const formula1Samples: SampleQuery[] = [
  {
    "id": "formula1-1",
    "name": "Driver Championship Points",
    "description": "Calculates total career race points and podium appearances per driver.",
    "sql": "SELECT\n    d.forename || ' ' || d.surname AS driver_name,\n    d.nationality,\n    COUNT(r.result_id) AS total_races,\n    SUM(r.points) AS career_points\nFROM drivers d\nINNER JOIN results r ON d.driver_id = r.driver_id\nGROUP BY d.driver_id, d.forename, d.surname, d.nationality\nORDER BY career_points DESC\nLIMIT 15;"
  },
  {
    "id": "formula1-2",
    "name": "Constructor Podium Success",
    "description": "Aggregates podium finishes and total points by constructor team.",
    "sql": "SELECT\n    c.name AS constructor_name,\n    c.nationality,\n    COUNT(r.result_id) AS race_entries,\n    SUM(r.points) AS total_constructor_points\nFROM constructors c\nINNER JOIN results r ON c.constructor_id = r.constructor_id\nGROUP BY c.constructor_id, c.name, c.nationality\nORDER BY total_constructor_points DESC\nLIMIT 10;"
  },
  {
    "id": "formula1-3",
    "name": "Top Pole Position Converters",
    "description": "Finds race wins achieved when starting from grid position 1.",
    "sql": "SELECT\n    d.forename || ' ' || d.surname AS driver_name,\n    COUNT(r.result_id) AS pole_wins\nFROM results r\nINNER JOIN drivers d ON r.driver_id = d.driver_id\nWHERE r.grid = 1 AND r.position = 1\nGROUP BY d.driver_id, d.forename, d.surname\nORDER BY pole_wins DESC;"
  },
  {
    "id": "formula1-4",
    "name": "Season Points Leader CTE",
    "description": "Calculates points per driver per season using CTE.",
    "sql": "WITH season_totals AS (\n    SELECT\n        ra.year AS season_year,\n        d.forename || ' ' || d.surname AS driver_name,\n        SUM(re.points) AS season_points\n    FROM results re\n    INNER JOIN races ra ON re.race_id = ra.race_id\n    INNER JOIN drivers d ON re.driver_id = d.driver_id\n    GROUP BY ra.year, d.driver_id, d.forename, d.surname\n)\nSELECT\n    season_year,\n    driver_name,\n    season_points\nFROM season_totals\nORDER BY season_year DESC, season_points DESC\nLIMIT 20;"
  },
  {
    "id": "formula1-5",
    "name": "Driver Points Ranking in Season",
    "description": "Ranks driver points in each championship season using RANK().",
    "sql": "SELECT\n    ra.year,\n    d.surname,\n    SUM(re.points) AS total_pts,\n    RANK() OVER (PARTITION BY ra.year ORDER BY SUM(re.points) DESC) AS season_rank\nFROM results re\nINNER JOIN races ra ON re.race_id = ra.race_id\nINNER JOIN drivers d ON re.driver_id = d.driver_id\nGROUP BY ra.year, d.driver_id, d.surname\nORDER BY ra.year DESC, season_rank\nLIMIT 30;"
  },
  {
    "id": "formula1-6",
    "name": "Circuit Win Distribution",
    "description": "Lists circuits with hosted grand prix counts and country origins.",
    "sql": "SELECT\n    c.name AS circuit_name,\n    c.location,\n    c.country,\n    COUNT(r.race_id) AS races_hosted\nFROM circuits c\nLEFT JOIN races r ON c.circuit_id = r.circuit_id\nGROUP BY c.circuit_id, c.name, c.location, c.country\nORDER BY races_hosted DESC;"
  },
  {
    "id": "formula1-7",
    "name": "Running Points Total Across Season",
    "description": "Calculates cumulative season points for drivers across rounds.",
    "sql": "SELECT\n    re.driver_id,\n    re.race_id,\n    re.points,\n    SUM(re.points) OVER (PARTITION BY re.driver_id ORDER BY re.race_id) AS cumulative_points\nFROM results re\nWHERE re.driver_id IN (1, 2, 3)\nORDER BY re.driver_id, re.race_id\nLIMIT 25;"
  },
  {
    "id": "formula1-8",
    "name": "Insert New Driver (Add Data)",
    "description": "Inserts a new racing driver profile.",
    "sql": "INSERT INTO drivers (driver_id, driver_ref, number, code, forename, surname, dob, nationality)\nVALUES (9901, 'novak', 42, 'NOV', 'Stefan', 'Novak', '2001-08-12', 'Austrian');"
  },
  {
    "id": "formula1-9",
    "name": "Update Constructor Nationality (Modify Data)",
    "description": "Updates registration country for constructor.",
    "sql": "UPDATE constructors\nSET nationality = 'Swiss'\nWHERE constructor_ref = 'sauber';"
  },
  {
    "id": "formula1-10",
    "name": "Delete Test Driver (Remove Data)",
    "description": "Removes the test driver profile.",
    "sql": "DELETE FROM drivers\nWHERE driver_id = 9901;"
  }
];
