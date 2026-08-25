import { SampleQuery } from './types';

export const premierLeagueSamples: SampleQuery[] = [
  {
    "id": "pl-1",
    "name": "Top Goal Scorers and Assist Leaders",
    "description": "Calculates total goal contributions per player across clubs.",
    "sql": "SELECT\n    p.name AS player_name,\n    t.name AS team_name,\n    p.position,\n    p.appearances,\n    p.goals,\n    p.assists,\n    (p.goals + p.assists) AS goal_contributions\nFROM players p\nINNER JOIN teams t ON p.team_id = t.team_id\nORDER BY goal_contributions DESC, p.goals DESC\nLIMIT 15;"
  },
  {
    "id": "pl-2",
    "name": "Club Stadium Capacity and Squad Goals",
    "description": "Aggregates total squad goals and stadium sizes per team.",
    "sql": "SELECT\n    t.name AS team_name,\n    t.stadium,\n    t.capacity,\n    COUNT(p.player_id) AS squad_size,\n    SUM(p.goals) AS total_goals_scored\nFROM teams t\nLEFT JOIN players p ON t.team_id = p.team_id\nGROUP BY t.team_id, t.name, t.stadium, t.capacity\nORDER BY total_goals_scored DESC;"
  },
  {
    "id": "pl-3",
    "name": "High Scoring Matches",
    "description": "Finds matches with total combined score exceeding league average.",
    "sql": "SELECT\n    m.match_date,\n    ht.name AS home_team,\n    m.home_score,\n    at.name AS away_team,\n    m.away_score,\n    (m.home_score + m.away_score) AS match_total_goals\nFROM matches m\nINNER JOIN teams ht ON m.home_team_id = ht.team_id\nINNER JOIN teams at ON m.away_team_id = at.team_id\nWHERE (m.home_score + m.away_score) > (\n    SELECT AVG(home_score + away_score) FROM matches\n)\nORDER BY match_total_goals DESC\nLIMIT 20;"
  },
  {
    "id": "pl-4",
    "name": "Home Match Win Ratio CTE",
    "description": "Computes home win percentages across all league teams.",
    "sql": "WITH home_outcomes AS (\n    SELECT\n        home_team_id,\n        COUNT(match_id) AS home_games,\n        SUM(CASE WHEN home_score > away_score THEN 1 ELSE 0 END) AS home_wins,\n        SUM(home_score) AS home_goals_scored\n    FROM matches\n    GROUP BY home_team_id\n)\nSELECT\n    t.name AS team_name,\n    ho.home_games,\n    ho.home_wins,\n    ROUND(ho.home_wins * 100.0 / ho.home_games, 1) AS home_win_pct,\n    ho.home_goals_scored\nFROM home_outcomes ho\nINNER JOIN teams t ON ho.home_team_id = t.team_id\nORDER BY home_win_pct DESC;"
  },
  {
    "id": "pl-5",
    "name": "Player Goals Ranking by Position",
    "description": "Ranks goal scorers within each field position using DENSE_RANK().",
    "sql": "SELECT\n    position,\n    name,\n    goals,\n    appearances,\n    DENSE_RANK() OVER (PARTITION BY position ORDER BY goals DESC) AS position_goal_rank\nFROM players\nLIMIT 30;"
  },
  {
    "id": "pl-6",
    "name": "Referee Match Frequency",
    "description": "Summarizes match assignments and average goals per match officiated.",
    "sql": "SELECT\n    referee,\n    COUNT(match_id) AS matches_officiated,\n    ROUND(AVG(home_score + away_score), 2) AS avg_goals_per_game\nFROM matches\nGROUP BY referee\nORDER BY matches_officiated DESC;"
  },
  {
    "id": "pl-7",
    "name": "Cumulative Home Goals Across Season",
    "description": "Calculates running home goal totals chronologically for each club.",
    "sql": "SELECT\n    home_team_id,\n    match_date,\n    home_score,\n    SUM(home_score) OVER (PARTITION BY home_team_id ORDER BY match_date) AS cumulative_home_goals\nFROM matches\nLIMIT 30;"
  },
  {
    "id": "pl-8",
    "name": "Insert New Player (Add Data)",
    "description": "Signs a new forward to a Premier League club.",
    "sql": "INSERT INTO players (player_id, name, team_id, position, nationality, appearances, goals, assists)\nVALUES (9901, 'Marcus Sterling', 1, 'Forward', 'England', 12, 7, 3);"
  },
  {
    "id": "pl-9",
    "name": "Update Stadium Capacity (Modify Data)",
    "description": "Updates seating capacity following stadium expansion.",
    "sql": "UPDATE teams\nSET capacity = capacity + 5000\nWHERE name = 'Arsenal';"
  },
  {
    "id": "pl-10",
    "name": "Delete Test Player (Remove Data)",
    "description": "Removes the test player contract record.",
    "sql": "DELETE FROM players\nWHERE player_id = 9901;"
  }
];
