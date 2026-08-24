import { SampleQuery } from './chinook';

export const githubSamples: SampleQuery[] = [
  {
    id: 'gh-1',
    name: 'Top Starred Repositories and Primary Language',
    description: 'Lists popular open repositories with star counts and license details.',
    sql: `SELECT
    r.repo_name,
    u.username AS owner,
    r.primary_language,
    r.stars_count,
    r.forks_count,
    r.open_issues_count
FROM repositories r
INNER JOIN users u ON r.owner_id = u.user_id
WHERE r.is_private = 0
ORDER BY r.stars_count DESC;`,
  },
  {
    id: 'gh-2',
    name: 'Pull Request Review and Merge Statistics',
    description: 'Calculates pull request counts and average time to merge per author.',
    sql: `SELECT
    u.username AS author,
    COUNT(pr.pr_id) AS total_pull_requests,
    SUM(CASE WHEN pr.state = 'merged' THEN 1 ELSE 0 END) AS merged_prs,
    ROUND(AVG(pr.comments_count), 1) AS avg_discussion_comments
FROM pull_requests pr
INNER JOIN users u ON pr.author_id = u.user_id
GROUP BY u.user_id, u.username
ORDER BY merged_prs DESC;`,
  },
  {
    id: 'gh-3',
    name: 'Top Contributor Commit Ranks CTE',
    description: 'Ranks top code contributors across repositories using Common Table Expressions.',
    sql: `WITH author_commits AS (
    SELECT
        c.repo_id,
        c.author_id,
        COUNT(c.commit_id) AS total_commits,
        SUM(c.lines_added) AS total_lines_added,
        SUM(c.lines_deleted) AS total_lines_deleted
    FROM commits c
    GROUP BY c.repo_id, c.author_id
)
SELECT
    r.repo_name,
    u.username AS contributor,
    ac.total_commits,
    ac.total_lines_added,
    ac.total_lines_deleted
FROM author_commits ac
INNER JOIN repositories r ON ac.repo_id = r.repo_id
INNER JOIN users u ON ac.author_id = u.user_id
ORDER BY ac.total_commits DESC;`,
  },
];
