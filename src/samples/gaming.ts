import { SampleQuery } from './chinook';

export const gamingSamples: SampleQuery[] = [
  {
    id: 'game-1',
    name: 'Top Ranked Players with Guild and Win Rates',
    description: 'Retrieves player leaderboard rankings, guild affiliations, and combat ratings.',
    sql: `SELECT
    p.gamer_tag,
    g.guild_name,
    p.level,
    p.rank_tier,
    p.matches_played,
    p.matches_won,
    ROUND((p.matches_won * 1.0 / p.matches_played) * 100.0, 1) AS win_rate_pct,
    p.total_score
FROM players p
LEFT JOIN guilds g ON p.guild_id = g.guild_id
WHERE p.matches_played > 0
ORDER BY p.total_score DESC;`,
  },
  {
    id: 'game-2',
    name: 'Weapon Usage and Elimination Statistics',
    description: 'Calculates weapon kills, damage dealt, and accuracy averages across match logs.',
    sql: `SELECT
    w.name AS weapon_name,
    w.weapon_class,
    COUNT(ms.stat_id) AS times_used,
    SUM(ms.kills) AS total_kills,
    SUM(ms.damage_dealt) AS total_damage,
    ROUND(AVG(ms.accuracy_pct), 1) AS avg_accuracy
FROM weapons w
INNER JOIN match_stats ms ON w.weapon_id = ms.weapon_id
GROUP BY w.weapon_id, w.name, w.weapon_class
ORDER BY total_kills DESC;`,
  },
  {
    id: 'game-3',
    name: 'Player Kill Death Ratio Leaderboard CTE',
    description: 'Computes overall K/D ratios and eliminates players below minimum match threshold.',
    sql: `WITH combat_totals AS (
    SELECT
        player_id,
        SUM(kills) AS total_kills,
        SUM(deaths) AS total_deaths,
        SUM(headshots) AS total_headshots
    FROM match_stats
    GROUP BY player_id
)
SELECT
    p.gamer_tag,
    p.rank_tier,
    ct.total_kills,
    ct.total_deaths,
    ROUND(ct.total_kills * 1.0 / MAX(ct.total_deaths, 1), 2) AS kd_ratio,
    ct.total_headshots
FROM players p
INNER JOIN combat_totals ct ON p.player_id = ct.player_id
ORDER BY kd_ratio DESC;`,
  },
];
