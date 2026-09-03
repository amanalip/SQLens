import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const formula1Expansion: SampleQuery[] = [
  sample('formula1-11', 'Best Grid Comebacks', 'Ranks finishes where drivers gained the most positions from the starting grid.', `SELECT r.year, r.name AS race, d.forename || ' ' || d.surname AS driver,
       re.grid, re.position, re.grid - re.position AS places_gained
FROM results re
JOIN races r ON re.race_id = r.race_id
JOIN drivers d ON re.driver_id = d.driver_id
WHERE re.grid > 0 AND re.position IS NOT NULL
ORDER BY places_gained DESC
LIMIT 25;`),
    sample('formula1-12', 'Constructor Finish Reliability', 'Compares constructors by laps completed and classified finishes.', `SELECT c.name AS constructor, COUNT(*) AS entries,
       ROUND(AVG(re.laps), 1) AS avg_laps,
       SUM(CASE WHEN re.position IS NOT NULL THEN 1 ELSE 0 END) AS classified_finishes
FROM results re
JOIN constructors c ON re.constructor_id = c.constructor_id
GROUP BY c.constructor_id, c.name
ORDER BY classified_finishes DESC, avg_laps DESC;`),
    sample('formula1-13', 'Driver Points by Season', 'Ranks drivers by total points within each racing season.', `WITH season_points AS (
    SELECT r.year, re.driver_id, SUM(re.points) AS points
    FROM results re JOIN races r ON re.race_id = r.race_id
    GROUP BY r.year, re.driver_id
)
SELECT sp.year, d.forename || ' ' || d.surname AS driver, sp.points,
       DENSE_RANK() OVER (PARTITION BY sp.year ORDER BY sp.points DESC) AS season_rank
FROM season_points sp JOIN drivers d ON sp.driver_id = d.driver_id
ORDER BY sp.year DESC, season_rank;`),
    ...profileSamples({ key: 'formula1', table: 'results', subject: 'race results', value: 'points', valueLabel: 'Points', category: 'constructor_id', categoryLabel: 'Constructor', id: 'result_id' })
];
