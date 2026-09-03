import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const githubExpansion: SampleQuery[] = [
  sample('github-11', 'Repository Code Churn', 'Measures added and deleted lines to reveal the busiest repositories.', `SELECT r.repo_name, COUNT(c.commit_id) AS commits,
       SUM(c.lines_added) AS lines_added, SUM(c.lines_deleted) AS lines_deleted,
       SUM(c.lines_added + c.lines_deleted) AS total_churn
FROM repositories r LEFT JOIN commits c ON r.repo_id = c.repo_id
GROUP BY r.repo_id, r.repo_name
ORDER BY total_churn DESC;`),
    sample('github-12', 'Cross Repository Contributors', 'Finds developers who have committed to multiple repositories.', `SELECT u.username, COUNT(DISTINCT c.repo_id) AS repositories, COUNT(c.commit_id) AS commits
FROM users u JOIN commits c ON u.user_id = c.author_id
GROUP BY u.user_id, u.username
HAVING COUNT(DISTINCT c.repo_id) > 1
ORDER BY repositories DESC, commits DESC;`),
    sample('github-13', 'Issue Pressure by Language', 'Compares open issue counts with stars for each primary language.', `SELECT primary_language, COUNT(*) AS repositories, SUM(open_issues_count) AS open_issues,
       SUM(stars_count) AS stars,
       ROUND(SUM(open_issues_count) * 100.0 / NULLIF(SUM(stars_count), 0), 2) AS issues_per_100_stars
FROM repositories
WHERE primary_language IS NOT NULL
GROUP BY primary_language
ORDER BY issues_per_100_stars DESC;`),
    ...profileSamples({ key: 'github', table: 'repositories', subject: 'repositories', value: 'stars_count', valueLabel: 'Stars', category: 'primary_language', categoryLabel: 'Language', id: 'repo_id' })
];
