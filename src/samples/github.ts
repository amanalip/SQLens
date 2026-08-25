import { SampleQuery } from './types';

export const githubSamples: SampleQuery[] = [
  {
    "id": "github-1",
    "name": "Top Starred Repositories",
    "description": "Lists public repositories with star counts and primary programming languages.",
    "sql": "SELECT\n    r.repo_name,\n    u.username AS owner_name,\n    r.primary_language,\n    r.stars_count,\n    r.forks_count,\n    r.open_issues_count\nFROM repositories r\nINNER JOIN users u ON r.owner_id = u.user_id\nWHERE r.is_private = 0\nORDER BY r.stars_count DESC\nLIMIT 15;"
  },
  {
    "id": "github-2",
    "name": "Developer Commit Activity",
    "description": "Aggregates lines added and total commits contributed per developer.",
    "sql": "SELECT\n    u.username,\n    u.full_name,\n    u.company,\n    COUNT(c.commit_id) AS total_commits,\n    SUM(c.lines_added) AS total_lines_added,\n    SUM(c.lines_deleted) AS total_lines_deleted\nFROM users u\nINNER JOIN commits c ON u.user_id = c.author_id\nGROUP BY u.user_id, u.username, u.full_name, u.company\nORDER BY total_commits DESC;"
  },
  {
    "id": "github-3",
    "name": "High Impact Repos Above Average",
    "description": "Finds repositories whose stars and forks exceed platform averages.",
    "sql": "SELECT\n    repo_name,\n    primary_language,\n    stars_count,\n    forks_count\nFROM repositories\nWHERE stars_count > (SELECT AVG(stars_count) FROM repositories)\n  AND forks_count > (SELECT AVG(forks_count) FROM repositories)\nORDER BY stars_count DESC;"
  },
  {
    "id": "github-4",
    "name": "Language Ecosystem Stars CTE",
    "description": "Aggregates repository counts and total stars by primary language.",
    "sql": "WITH language_stats AS (\n    SELECT\n        primary_language,\n        COUNT(repo_id) AS repo_count,\n        SUM(stars_count) AS total_stars,\n        SUM(forks_count) AS total_forks\n    FROM repositories\n    GROUP BY primary_language\n)\nSELECT\n    primary_language,\n    repo_count,\n    total_stars,\n    total_forks\nFROM language_stats\nORDER BY total_stars DESC;"
  },
  {
    "id": "github-5",
    "name": "Repo Stars Ranking by Language",
    "description": "Ranks repos by star count within each programming language.",
    "sql": "SELECT\n    primary_language,\n    repo_name,\n    stars_count,\n    RANK() OVER (PARTITION BY primary_language ORDER BY stars_count DESC) AS language_star_rank\nFROM repositories\nLIMIT 30;"
  },
  {
    "id": "github-6",
    "name": "Pull Request Review Activity",
    "description": "Summarizes pull request statuses and discussion comments.",
    "sql": "SELECT\n    r.repo_name,\n    pr.title,\n    pr.state,\n    pr.comments_count,\n    u.username AS author\nFROM pull_requests pr\nINNER JOIN repositories r ON pr.repo_id = r.repo_id\nINNER JOIN users u ON pr.author_id = u.user_id\nORDER BY pr.comments_count DESC\nLIMIT 15;"
  },
  {
    "id": "github-7",
    "name": "Cumulative Lines Added by Author",
    "description": "Tracks running total lines of code added per author across commits.",
    "sql": "SELECT\n    author_id,\n    committed_date,\n    lines_added,\n    SUM(lines_added) OVER (PARTITION BY author_id ORDER BY committed_date) AS cumulative_lines\nFROM commits\nLIMIT 25;"
  },
  {
    "id": "github-8",
    "name": "Insert New Repository (Add Data)",
    "description": "Creates a new open-source repository.",
    "sql": "INSERT INTO repositories (repo_id, repo_name, owner_id, primary_language, stars_count, forks_count, open_issues_count, is_private)\nVALUES (9901, 'vector-engine', 1, 'Rust', 350, 42, 3, 0);"
  },
  {
    "id": "github-9",
    "name": "Update Repository Star Count (Modify Data)",
    "description": "Increments star counts for popular repositories.",
    "sql": "UPDATE repositories\nSET stars_count = stars_count + 100\nWHERE primary_language = 'TypeScript';"
  },
  {
    "id": "github-10",
    "name": "Delete Test Repository (Remove Data)",
    "description": "Removes the test repository record.",
    "sql": "DELETE FROM repositories\nWHERE repo_id = 9901;"
  }
];
