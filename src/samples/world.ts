import { SampleQuery } from './types';

export const worldSamples: SampleQuery[] = [
  {
    "id": "world-1",
    "name": "Top Populated Countries",
    "description": "Lists countries with highest population and calculates population density.",
    "sql": "SELECT\n    name,\n    continent,\n    population,\n    surface_area,\n    ROUND(population * 1.0 / surface_area, 2) AS density_per_sq_km\nFROM countries\nWHERE population > 50000000\nORDER BY population DESC;"
  },
  {
    "id": "world-2",
    "name": "Cities with Country Context",
    "description": "Joins cities with host countries and filters for major metropolitan areas.",
    "sql": "SELECT\n    ci.name AS city_name,\n    co.name AS country_name,\n    co.continent,\n    ci.population AS city_population\nFROM cities ci\nINNER JOIN countries co ON ci.country_code = co.code\nWHERE ci.population > 2000000\nORDER BY ci.population DESC;"
  },
  {
    "id": "world-3",
    "name": "Countries with High Life Expectancy",
    "description": "Finds countries whose life expectancy exceeds continental averages.",
    "sql": "SELECT\n    name,\n    continent,\n    life_expectancy,\n    gnp\nFROM countries\nWHERE life_expectancy > (\n    SELECT AVG(life_expectancy) FROM countries WHERE life_expectancy IS NOT NULL\n)\nORDER BY life_expectancy DESC\nLIMIT 20;"
  },
  {
    "id": "world-4",
    "name": "Continent Wealth and Demographics CTE",
    "description": "Aggregates total population, GNP, and average life expectancy by continent.",
    "sql": "WITH continent_stats AS (\n    SELECT\n        continent,\n        COUNT(code) AS country_count,\n        SUM(population) AS total_population,\n        SUM(gnp) AS total_gnp,\n        AVG(life_expectancy) AS avg_life_exp\n    FROM countries\n    GROUP BY continent\n)\nSELECT\n    continent,\n    country_count,\n    total_population,\n    ROUND(total_gnp, 2) AS total_gnp,\n    ROUND(avg_life_exp, 1) AS avg_life_exp\nFROM continent_stats\nORDER BY total_gnp DESC;"
  },
  {
    "id": "world-5",
    "name": "Country Population Rank by Continent",
    "description": "Ranks country populations within each continent using RANK().",
    "sql": "SELECT\n    continent,\n    name,\n    population,\n    RANK() OVER (PARTITION BY continent ORDER BY population DESC) AS continent_pop_rank\nFROM countries\nORDER BY continent, continent_pop_rank\nLIMIT 30;"
  },
  {
    "id": "world-6",
    "name": "Official Languages per Country",
    "description": "Lists official languages and their speaker percentages.",
    "sql": "SELECT\n    co.name AS country_name,\n    cl.language,\n    cl.percentage\nFROM country_languages cl\nINNER JOIN countries co ON cl.country_code = co.code\nWHERE cl.is_official = 'T' AND cl.percentage > 50.0\nORDER BY cl.percentage DESC;"
  },
  {
    "id": "world-7",
    "name": "City Population Share in Country",
    "description": "Calculates city population share against total city population in that country.",
    "sql": "SELECT\n    country_code,\n    name,\n    population,\n    SUM(population) OVER (PARTITION BY country_code) AS country_urban_total,\n    ROUND(population * 100.0 / SUM(population) OVER (PARTITION BY country_code), 2) AS pct_of_urban\nFROM cities\nWHERE country_code IN ('USA', 'GBR', 'FRA', 'DEU', 'JPN')\nORDER BY country_code, population DESC;"
  },
  {
    "id": "world-8",
    "name": "Insert New City (Add Data)",
    "description": "Inserts a new city record into the database.",
    "sql": "INSERT INTO cities (id, name, country_code, district, population)\nVALUES (9901, 'Neo Metropolis', 'USA', 'California', 1250000);"
  },
  {
    "id": "world-9",
    "name": "Update Country Life Expectancy (Modify Data)",
    "description": "Updates life expectancy estimates for small island nations.",
    "sql": "UPDATE countries\nSET life_expectancy = 78.5\nWHERE continent = 'Oceania' AND population < 100000;"
  },
  {
    "id": "world-10",
    "name": "Delete Test City (Remove Data)",
    "description": "Removes the test city record from the database.",
    "sql": "DELETE FROM cities\nWHERE id = 9901;"
  }
];
