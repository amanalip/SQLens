import { SampleQuery } from './types';

export const pokemonSamples: SampleQuery[] = [
  {
    "id": "pokemon-1",
    "name": "Highest Base Stat Total Pokemon",
    "description": "Calculates overall battle stat totals for competitive Pokemon.",
    "sql": "SELECT\n    pokedex_number,\n    name,\n    primary_type,\n    secondary_type,\n    hp,\n    attack,\n    defense,\n    special_attack,\n    special_defense,\n    speed,\n    (hp + attack + defense + special_attack + special_defense + speed) AS base_stat_total\nFROM pokemon\nORDER BY base_stat_total DESC\nLIMIT 15;"
  },
  {
    "id": "pokemon-2",
    "name": "Elemental Type Stat Averages",
    "description": "Aggregates average attack, defense, and speed across primary types.",
    "sql": "SELECT\n    primary_type,\n    COUNT(pokedex_number) AS species_count,\n    ROUND(AVG(attack), 1) AS avg_attack,\n    ROUND(AVG(defense), 1) AS avg_defense,\n    ROUND(AVG(speed), 1) AS avg_speed\nFROM pokemon\nGROUP BY primary_type\nORDER BY avg_attack DESC;"
  },
  {
    "id": "pokemon-3",
    "name": "Fastest Attack Sweepers",
    "description": "Finds non-legendary Pokemon with speed and attack above average.",
    "sql": "SELECT\n    name,\n    primary_type,\n    attack,\n    speed\nFROM pokemon\nWHERE is_legendary = 0\n  AND attack > (SELECT AVG(attack) FROM pokemon)\n  AND speed > (SELECT AVG(speed) FROM pokemon)\nORDER BY speed DESC, attack DESC;"
  },
  {
    "id": "pokemon-4",
    "name": "Generation Power Creep CTE",
    "description": "Analyzes average battle stats across regional generations.",
    "sql": "WITH gen_stats AS (\n    SELECT\n        g.region,\n        p.generation_id,\n        AVG(p.hp + p.attack + p.defense + p.special_attack + p.special_defense + p.speed) AS avg_bst,\n        COUNT(p.pokedex_number) AS pokemon_count\n    FROM pokemon p\n    INNER JOIN generations g ON p.generation_id = g.generation_id\n    GROUP BY p.generation_id, g.region\n)\nSELECT\n    generation_id,\n    region,\n    pokemon_count,\n    ROUND(avg_bst, 1) AS avg_base_stat_total\nFROM gen_stats\nORDER BY generation_id ASC;"
  },
  {
    "id": "pokemon-5",
    "name": "Speed Ranking by Primary Type",
    "description": "Ranks species speed within each primary elemental type.",
    "sql": "SELECT\n    primary_type,\n    name,\n    speed,\n    RANK() OVER (PARTITION BY primary_type ORDER BY speed DESC) AS type_speed_rank\nFROM pokemon\nLIMIT 30;"
  },
  {
    "id": "pokemon-6",
    "name": "Hidden Ability Species List",
    "description": "Lists Pokemon associated with rare hidden abilities.",
    "sql": "SELECT\n    p.name AS pokemon_name,\n    a.name AS ability_name,\n    a.effect\nFROM pokemon p\nINNER JOIN pokemon_abilities pa ON p.pokedex_number = pa.pokedex_number\nINNER JOIN abilities a ON pa.ability_id = a.ability_id\nWHERE pa.is_hidden = 1\nORDER BY p.pokedex_number;"
  },
  {
    "id": "pokemon-7",
    "name": "Cumulative Stat Accumulation",
    "description": "Calculates running stat totals partitioned by primary type.",
    "sql": "SELECT\n    primary_type,\n    name,\n    attack,\n    SUM(attack) OVER (PARTITION BY primary_type ORDER BY pokedex_number) AS running_type_attack\nFROM pokemon\nLIMIT 25;"
  },
  {
    "id": "pokemon-8",
    "name": "Insert Custom Pokemon (Add Data)",
    "description": "Creates a custom regional species entry.",
    "sql": "INSERT INTO pokemon (pokedex_number, name, primary_type, secondary_type, generation_id, hp, attack, defense, special_attack, special_defense, speed, is_legendary)\nVALUES (9901, 'Voltash', 'Electric', 'Steel', 1, 75, 110, 85, 95, 80, 125, 0);"
  },
  {
    "id": "pokemon-9",
    "name": "Update Pokemon Battle Stats (Modify Data)",
    "description": "Applies stat balancing to legendary species.",
    "sql": "UPDATE pokemon\nSET speed = speed + 5\nWHERE is_legendary = 1 AND speed < 100;"
  },
  {
    "id": "pokemon-10",
    "name": "Delete Test Pokemon (Remove Data)",
    "description": "Removes the test species entry.",
    "sql": "DELETE FROM pokemon\nWHERE pokedex_number = 9901;"
  }
];
