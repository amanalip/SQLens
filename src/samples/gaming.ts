import { SampleQuery } from './types';

export const gamingSamples: SampleQuery[] = [
  {
    "id": "gaming-1",
    "name": "Guild Leaderboard & Win Rates",
    "description": "Calculates member count and aggregate win rates across esports guilds.",
    "sql": "SELECT\n    g.guild_name,\n    g.tag,\n    g.region,\n    COUNT(p.player_id) AS total_members,\n    SUM(p.matches_won) AS guild_wins,\n    ROUND(SUM(p.matches_won) * 100.0 / NULLIF(SUM(p.matches_played), 0), 1) AS guild_win_rate_pct\nFROM guilds g\nLEFT JOIN players p ON g.guild_id = p.guild_id\nGROUP BY g.guild_id, g.guild_name, g.tag, g.region\nORDER BY guild_wins DESC;"
  },
  {
    "id": "gaming-2",
    "name": "Player Combat Weapon Stats",
    "description": "Analyzes kills, damage dealt, and accuracy percentages per player weapon loadout.",
    "sql": "SELECT\n    p.gamer_tag,\n    p.rank_tier,\n    w.name AS weapon_name,\n    w.weapon_class,\n    SUM(ms.kills) AS total_kills,\n    SUM(ms.damage_dealt) AS total_damage,\n    ROUND(AVG(ms.accuracy_pct), 1) AS avg_accuracy\nFROM match_stats ms\nINNER JOIN players p ON ms.player_id = p.player_id\nINNER JOIN weapons w ON ms.weapon_id = w.weapon_id\nGROUP BY p.player_id, p.gamer_tag, p.rank_tier, w.weapon_id, w.name, w.weapon_class\nORDER BY total_kills DESC\nLIMIT 15;"
  },
  {
    "id": "gaming-3",
    "name": "High Accuracy Snipers Above Average",
    "description": "Finds weapon stats with accuracy exceeding overall multiplayer average.",
    "sql": "SELECT\n    p.gamer_tag,\n    w.name AS weapon,\n    ms.kills,\n    ms.headshots,\n    ms.accuracy_pct\nFROM match_stats ms\nINNER JOIN players p ON ms.player_id = p.player_id\nINNER JOIN weapons w ON ms.weapon_id = w.weapon_id\nWHERE ms.accuracy_pct > (SELECT AVG(accuracy_pct) FROM match_stats)\nORDER BY ms.accuracy_pct DESC\nLIMIT 20;"
  },
  {
    "id": "gaming-4",
    "name": "Player Rank Tier Performance CTE",
    "description": "Aggregates match stats and scoring by competitive rank tier.",
    "sql": "WITH tier_stats AS (\n    SELECT\n        rank_tier,\n        COUNT(player_id) AS player_count,\n        AVG(level) AS avg_level,\n        AVG(total_score) AS avg_score\n    FROM players\n    GROUP BY rank_tier\n)\nSELECT\n    rank_tier,\n    player_count,\n    ROUND(avg_level, 0) AS avg_level,\n    ROUND(avg_score, 0) AS avg_total_score\nFROM tier_stats\nORDER BY avg_total_score DESC;"
  },
  {
    "id": "gaming-5",
    "name": "Player Score Rank by Guild",
    "description": "Ranks member total scores within each guild.",
    "sql": "SELECT\n    guild_id,\n    gamer_tag,\n    total_score,\n    RANK() OVER (PARTITION BY guild_id ORDER BY total_score DESC) AS guild_rank\nFROM players\nLIMIT 30;"
  },
  {
    "id": "gaming-6",
    "name": "Weapon Class Lethality Breakdown",
    "description": "Summarizes base damage and match usage across weapon classes.",
    "sql": "SELECT\n    weapon_class,\n    COUNT(weapon_id) AS weapon_count,\n    ROUND(AVG(base_damage), 1) AS avg_base_damage\nFROM weapons\nGROUP BY weapon_class\nORDER BY avg_base_damage DESC;"
  },
  {
    "id": "gaming-7",
    "name": "Cumulative Player Damage Dealt",
    "description": "Calculates running damage dealt per player across matches.",
    "sql": "SELECT\n    player_id,\n    stat_id,\n    damage_dealt,\n    SUM(damage_dealt) OVER (PARTITION BY player_id ORDER BY stat_id) AS cumulative_damage\nFROM match_stats\nLIMIT 25;"
  },
  {
    "id": "gaming-8",
    "name": "Insert New Player (Add Data)",
    "description": "Creates a new competitive esports player profile.",
    "sql": "INSERT INTO players (player_id, gamer_tag, guild_id, level, rank_tier, matches_played, matches_won, total_score)\nVALUES (9901, 'VortexNinja', 1, 45, 'Diamond', 120, 84, 18500);"
  },
  {
    "id": "gaming-9",
    "name": "Update Player Level (Modify Data)",
    "description": "Increments levels for winning players.",
    "sql": "UPDATE players\nSET level = level + 1\nWHERE matches_won > 50;"
  },
  {
    "id": "gaming-10",
    "name": "Delete Test Player (Remove Data)",
    "description": "Removes the test player profile.",
    "sql": "DELETE FROM players\nWHERE player_id = 9901;"
  }
];
