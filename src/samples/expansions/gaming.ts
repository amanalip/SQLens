import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const gamingExpansion: SampleQuery[] = [
  sample('gaming-11', 'Headshot Efficiency Leaders', 'Ranks players by headshot share while requiring a meaningful kill count.', `SELECT p.gamer_tag, SUM(ms.kills) AS kills, SUM(ms.headshots) AS headshots,
       ROUND(100.0 * SUM(ms.headshots) / NULLIF(SUM(ms.kills), 0), 1) AS headshot_pct
FROM players p JOIN match_stats ms ON p.player_id = ms.player_id
GROUP BY p.player_id, p.gamer_tag
HAVING SUM(ms.kills) >= 5
ORDER BY headshot_pct DESC;`),
    sample('gaming-12', 'Guild Win Rates', 'Compares guild activity and match win rates across regions.', `SELECT g.guild_name, g.region, COUNT(p.player_id) AS players,
       SUM(p.matches_played) AS matches,
       ROUND(100.0 * SUM(p.matches_won) / NULLIF(SUM(p.matches_played), 0), 1) AS win_rate_pct
FROM guilds g LEFT JOIN players p ON g.guild_id = p.guild_id
GROUP BY g.guild_id, g.guild_name, g.region
ORDER BY win_rate_pct DESC;`),
    sample('gaming-13', 'Weapon Performance by Class', 'Summarizes damage, accuracy, and kills for each weapon class.', `SELECT w.weapon_class, COUNT(DISTINCT ms.player_id) AS users,
       SUM(ms.kills) AS kills, ROUND(AVG(ms.accuracy_pct), 1) AS avg_accuracy,
       ROUND(AVG(ms.damage_dealt), 0) AS avg_damage
FROM weapons w JOIN match_stats ms ON w.weapon_id = ms.weapon_id
GROUP BY w.weapon_class
ORDER BY kills DESC;`),
    ...profileSamples({ key: 'gaming', table: 'players', subject: 'players', value: 'total_score', valueLabel: 'Player Scores', category: 'rank_tier', categoryLabel: 'Rank Tier', id: 'player_id' })
];
