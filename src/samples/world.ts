import { SampleQuery } from './chinook';

export const worldSamples: SampleQuery[] = [
  {
    id: 'world-1',
    name: 'Top Populated Countries and Capitals',
    description: 'Lists countries with their population, life expectancy, and capital city name.',
    sql: `SELECT
    co.name AS country,
    co.continent,
    co.population,
    co.life_expectancy,
    ci.name AS capital_city
FROM countries co
LEFT JOIN cities ci ON co.capital = ci.id
ORDER BY co.population DESC;`,
  },
  {
    id: 'world-2',
    name: 'Official Languages by Country',
    description: 'Finds countries and aggregates the percentage of people speaking official languages.',
    sql: `SELECT
    co.name AS country,
    cl.language,
    cl.percentage
FROM countries co
INNER JOIN country_languages cl ON co.code = cl.country_code
WHERE cl.is_official = 'T'
  AND cl.percentage > 50.0
ORDER BY cl.percentage DESC;`,
  },
  {
    id: 'world-3',
    name: 'Urban Population Density',
    description: 'Calculates total city population grouped by continent.',
    sql: `SELECT
    co.continent,
    COUNT(DISTINCT co.code) AS total_countries,
    COUNT(ci.id) AS total_major_cities,
    SUM(ci.population) AS total_urban_population
FROM countries co
INNER JOIN cities ci ON co.code = ci.country_code
GROUP BY co.continent
ORDER BY total_urban_population DESC;`,
  },
];
