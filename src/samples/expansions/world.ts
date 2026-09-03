import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const worldExpansion: SampleQuery[] = [
  sample('world-11', 'Capital City Population Share', 'Measures how much of each country population lives in its capital.', `SELECT co.name AS country, ci.name AS capital, ci.population AS capital_population,
       ROUND(ci.population * 100.0 / co.population, 2) AS country_population_pct
FROM countries co
JOIN cities ci ON co.capital = ci.id
WHERE co.population > 0
ORDER BY country_population_pct DESC
LIMIT 25;`),
    sample('world-12', 'Most Multilingual Countries', 'Ranks countries by the number of recorded languages and official languages.', `SELECT co.name, COUNT(cl.language) AS languages,
       SUM(CASE WHEN cl.is_official = 'T' THEN 1 ELSE 0 END) AS official_languages
FROM countries co
JOIN country_languages cl ON co.code = cl.country_code
GROUP BY co.code, co.name
ORDER BY languages DESC, official_languages DESC
LIMIT 20;`),
    sample('world-13', 'Economic Output per Person', 'Groups countries into per-capita GNP bands for a broad economic comparison.', `SELECT name, continent, ROUND(gnp * 1000000.0 / population, 2) AS gnp_per_person,
       CASE WHEN gnp * 1000000.0 / population >= 30000 THEN 'High'
            WHEN gnp * 1000000.0 / population >= 10000 THEN 'Middle'
            ELSE 'Low' END AS income_band
FROM countries
WHERE population > 0 AND gnp IS NOT NULL
ORDER BY gnp_per_person DESC;`),
    sample('world-14', 'Largest Non Capital Cities', 'Finds major cities that are not national capitals.', `SELECT ci.name AS city, co.name AS country, ci.population FROM cities ci JOIN countries co ON ci.country_code = co.code WHERE ci.id <> COALESCE(co.capital, -1) ORDER BY ci.population DESC LIMIT 25;`),
    sample('world-15', 'Regional Population Density', 'Compares population density across geographic regions.', `SELECT region, COUNT(*) AS countries, SUM(population) AS population, ROUND(SUM(population) / SUM(surface_area), 2) AS people_per_sq_km FROM countries WHERE surface_area > 0 GROUP BY region ORDER BY people_per_sq_km DESC;`),
    sample('world-16', 'Language Reach', 'Totals estimated speakers for each recorded language.', `SELECT cl.language, ROUND(SUM(co.population * cl.percentage / 100.0)) AS estimated_speakers, COUNT(*) AS countries FROM country_languages cl JOIN countries co ON cl.country_code = co.code GROUP BY cl.language ORDER BY estimated_speakers DESC LIMIT 25;`),
    sample('world-17', 'Urban Center Concentration', 'Compares the largest city with total listed city population in each country.', `SELECT co.name, MAX(ci.population) AS largest_city, SUM(ci.population) AS listed_city_population, ROUND(100.0 * MAX(ci.population) / SUM(ci.population), 1) AS concentration_pct FROM countries co JOIN cities ci ON co.code = ci.country_code GROUP BY co.code, co.name ORDER BY concentration_pct DESC;`),
    sample('world-18', 'Life Expectancy Gap', 'Shows the spread in life expectancy within each continent.', `SELECT continent, ROUND(MIN(life_expectancy), 1) AS lowest, ROUND(MAX(life_expectancy), 1) AS highest, ROUND(MAX(life_expectancy) - MIN(life_expectancy), 1) AS gap FROM countries WHERE life_expectancy IS NOT NULL GROUP BY continent ORDER BY gap DESC;`),
    sample('world-19', 'Countries Without Official Language', 'Finds countries with no language marked as official.', `SELECT co.code, co.name, co.continent FROM countries co LEFT JOIN country_languages cl ON co.code = cl.country_code AND cl.is_official = 'T' WHERE cl.country_code IS NULL ORDER BY co.continent, co.name;`),
    sample('world-20', 'GNP Rank Within Region', 'Ranks national GNP values among neighboring countries in the same region.', `SELECT region, name, gnp, DENSE_RANK() OVER (PARTITION BY region ORDER BY gnp DESC) AS region_rank FROM countries WHERE gnp IS NOT NULL ORDER BY region, region_rank;`),
];
