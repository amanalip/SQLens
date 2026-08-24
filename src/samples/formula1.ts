import { SampleQuery } from './chinook';

export const formula1Samples: SampleQuery[] = [
  {
    id: 'f1-1',
    name: 'Race Winners with Circuit Details',
    description: 'Lists race winners alongside circuit location and laps completed.',
    sql: `SELECT
    r.year,
    r.name AS race_name,
    c.name AS circuit_name,
    c.country,
    d.forename || ' ' || d.surname AS driver_name,
    res.laps,
    res.time AS race_time
FROM results res
INNER JOIN races r ON res.race_id = r.race_id
INNER JOIN circuits c ON r.circuit_id = c.circuit_id
INNER JOIN drivers d ON res.driver_id = d.driver_id
WHERE res.position = 1
ORDER BY r.year DESC, r.round ASC;`,
  },
  {
    id: 'f1-2',
    name: 'Constructor Points and Podium Count',
    description: 'Calculates total championship points and podium finishes per team.',
    sql: `SELECT
    con.name AS constructor_name,
    con.nationality,
    COUNT(res.result_id) AS race_entries,
    SUM(CASE WHEN res.position <= 3 THEN 1 ELSE 0 END) AS podium_finishes,
    SUM(res.points) AS total_points
FROM results res
INNER JOIN constructors con ON res.constructor_id = con.constructor_id
GROUP BY con.constructor_id, con.name, con.nationality
HAVING SUM(res.points) > 0
ORDER BY total_points DESC;`,
  },
  {
    id: 'f1-3',
    name: 'Driver Career Summary CTE',
    description: 'Computes driver wins and average finish positions using a Common Table Expression.',
    sql: `WITH driver_stats AS (
    SELECT
        driver_id,
        COUNT(result_id) AS total_starts,
        SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END) AS wins,
        ROUND(AVG(position), 1) AS avg_finish,
        SUM(points) AS career_points
    FROM results
    GROUP BY driver_id
)
SELECT
    d.forename || ' ' || d.surname AS driver_name,
    d.nationality,
    ds.total_starts,
    ds.wins,
    ds.avg_finish,
    ds.career_points
FROM drivers d
INNER JOIN driver_stats ds ON d.driver_id = ds.driver_id
ORDER BY ds.wins DESC, ds.career_points DESC;`,
  },
];
