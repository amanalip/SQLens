import { SampleQuery } from './chinook';

export const pokemonSamples: SampleQuery[] = [
  {
    id: 'pk-1',
    name: 'Top Combat Stat Pokemon',
    description: 'Ranks Pokemon species by total combined combat stats.',
    sql: `SELECT
    p.pokedex_number,
    p.name,
    p.primary_type,
    p.secondary_type,
    p.hp,
    p.attack,
    p.defense,
    p.speed,
    (p.hp + p.attack + p.defense + p.special_attack + p.special_defense + p.speed) AS total_stats
FROM pokemon p
ORDER BY total_stats DESC;`,
  },
  {
    id: 'pk-2',
    name: 'Average Attack and Speed by Primary Type',
    description: 'Calculates combat stat averages grouped by elemental type.',
    sql: `SELECT
    p.primary_type,
    COUNT(p.pokedex_number) AS species_count,
    ROUND(AVG(p.attack), 1) AS avg_attack,
    ROUND(AVG(p.defense), 1) AS avg_defense,
    ROUND(AVG(p.speed), 1) AS avg_speed
FROM pokemon p
GROUP BY p.primary_type
HAVING COUNT(p.pokedex_number) >= 3
ORDER BY avg_attack DESC;`,
  },
  {
    id: 'pk-3',
    name: 'Speed Tier Classification CASE',
    description: 'Categorizes Pokemon species into speed brackets.',
    sql: `SELECT
    p.name,
    p.primary_type,
    p.speed,
    CASE
        WHEN p.speed >= 100 THEN 'Fast Sweeper'
        WHEN p.speed >= 70 THEN 'Mid Tier'
        ELSE 'Defensive / Slow'
    END AS speed_bracket
FROM pokemon p
ORDER BY p.speed DESC;`,
  },
];
