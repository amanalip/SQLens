import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const premier_leagueExpansion: SampleQuery[] = [
  sample('premier-league-11', 'Home Field Advantage', 'Compares each team wins and goals from home fixtures.', `SELECT t.name, COUNT(m.match_id) AS home_matches,
       SUM(CASE WHEN m.home_score > m.away_score THEN 1 ELSE 0 END) AS home_wins,
       SUM(m.home_score) AS home_goals
FROM teams t LEFT JOIN matches m ON t.team_id = m.home_team_id
GROUP BY t.team_id, t.name
ORDER BY home_wins DESC, home_goals DESC;`),
    sample('premier-league-12', 'Team Goal Contributors', 'Measures how much each player contributes through goals and assists.', `SELECT t.name AS team, p.name AS player, p.goals, p.assists,
       p.goals + p.assists AS goal_contributions,
       ROUND((p.goals + p.assists) * 100.0 /
         NULLIF(SUM(p.goals + p.assists) OVER (PARTITION BY p.team_id), 0), 1) AS team_share_pct
FROM players p JOIN teams t ON p.team_id = t.team_id
ORDER BY goal_contributions DESC;`),
    sample('premier-league-13', 'Highest Scoring Fixtures', 'Lists the matches with the most combined goals.', `SELECT m.match_date, h.name AS home_team, a.name AS away_team,
       m.home_score, m.away_score, m.home_score + m.away_score AS total_goals
FROM matches m
JOIN teams h ON m.home_team_id = h.team_id
JOIN teams a ON m.away_team_id = a.team_id
ORDER BY total_goals DESC, m.match_date DESC
LIMIT 20;`),
    ...profileSamples({ key: 'premier-league', table: 'players', subject: 'players', value: 'goals', valueLabel: 'Goals', category: 'position', categoryLabel: 'Position', id: 'player_id' })
];
