import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const pokemonExpansion: SampleQuery[] = [
  sample('pokemon-11', 'Rare Dual Type Pairings', 'Counts secondary type combinations that appear on only a few species.', `SELECT primary_type, secondary_type, COUNT(*) AS species_count
FROM pokemon
WHERE secondary_type IS NOT NULL
GROUP BY primary_type, secondary_type
HAVING COUNT(*) <= 3
ORDER BY species_count, primary_type, secondary_type;`),
    sample('pokemon-12', 'Ability Reach Across Generations', 'Shows which abilities occur across the widest range of regions.', `SELECT a.name AS ability, COUNT(DISTINCT pa.pokedex_number) AS species,
       COUNT(DISTINCT p.generation_id) AS generations
FROM abilities a
JOIN pokemon_abilities pa ON a.ability_id = pa.ability_id
JOIN pokemon p ON pa.pokedex_number = p.pokedex_number
GROUP BY a.ability_id, a.name
ORDER BY generations DESC, species DESC;`),
    sample('pokemon-13', 'Glass Cannon Candidates', 'Finds fast attackers whose offense greatly exceeds their physical defense.', `SELECT name, primary_type, attack, special_attack, defense, speed,
       MAX(attack, special_attack) - defense AS offense_defense_gap
FROM pokemon
WHERE speed >= 90
ORDER BY offense_defense_gap DESC
LIMIT 20;`),
    ...profileSamples({ key: 'pokemon', table: 'pokemon', subject: 'Pokemon', value: 'attack', valueLabel: 'Attack', category: 'primary_type', categoryLabel: 'Primary Type', id: 'pokedex_number' })
];
