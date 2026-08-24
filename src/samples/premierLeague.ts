import { SampleQuery } from './chinook';

export const premierLeagueSamples: SampleQuery[] = [
  {
    id: 'pl-1',
    name: 'Match Results with Stadiums',
    description: 'Lists fixture outcomes with home and away team details.',
    sql: `SELECT
    m.match_date,
    ht.name AS home_team,
    m.home_score,
    m.away_score,
    at.name AS away_team,
    ht.stadium
FROM matches m
INNER JOIN teams ht ON m.home_team_id = ht.team_id
INNER JOIN teams at ON m.away_team_id = at.team_id
ORDER BY m.match_date DESC;`,
  },
  {
    id: 'pl-2',
    name: 'Top Goal Scorers and Assist Leaders',
    description: 'Ranks players by offensive contributions and goals scored.',
    sql: `SELECT
    p.name AS player_name,
    t.name AS team_name,
    p.position,
    p.appearances,
    p.goals,
    p.assists,
    (p.goals + p.assists) AS goal_involvements
FROM players p
INNER JOIN teams t ON p.team_id = t.team_id
ORDER BY p.goals DESC, p.assists DESC;`,
  },
  {
    id: 'pl-3',
    name: 'Team Match Points CTE',
    description: 'Calculates standings points from home and away results using Common Table Expressions.',
    sql: `WITH match_outcomes AS (
    SELECT
        home_team_id AS team_id,
        CASE
            WHEN home_score > away_score THEN 3
            WHEN home_score = away_score THEN 1
            ELSE 0
        END AS points,
        home_score AS goals_for,
        away_score AS goals_against
    FROM matches
    UNION ALL
    SELECT
        away_team_id AS team_id,
        CASE
            WHEN away_score > home_score THEN 3
            WHEN away_score = home_score THEN 1
            ELSE 0
        END AS points,
        away_score AS goals_for,
        home_score AS goals_against
    FROM matches
)
SELECT
    t.name AS team_name,
    COUNT(mo.points) AS matches_played,
    SUM(mo.points) AS total_points,
    SUM(mo.goals_for) AS total_goals_for,
    SUM(mo.goals_against) AS total_goals_against,
    (SUM(mo.goals_for) - SUM(mo.goals_against)) AS goal_difference
FROM teams t
INNER JOIN match_outcomes mo ON t.team_id = mo.team_id
GROUP BY t.team_id, t.name
ORDER BY total_points DESC, goal_difference DESC;`,
  },
];
