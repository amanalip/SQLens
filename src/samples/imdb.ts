import { SampleQuery } from './chinook';

export const imdbSamples: SampleQuery[] = [
  {
    id: 'imdb-1',
    name: 'Top Rated Movies by Director',
    description: 'Lists movies with high ratings alongside director and genre metadata.',
    sql: `SELECT
    m.title,
    m.release_year,
    m.runtime_minutes,
    m.imdb_rating,
    d.name AS director_name,
    g.name AS genre_name
FROM movies m
INNER JOIN directors d ON m.director_id = d.director_id
INNER JOIN movie_genres mg ON m.movie_id = mg.movie_id
INNER JOIN genres g ON mg.genre_id = g.genre_id
WHERE m.imdb_rating >= 8.5
ORDER BY m.imdb_rating DESC, m.release_year DESC;`,
  },
  {
    id: 'imdb-2',
    name: 'Director Filmography and Average Rating',
    description: 'Calculates movie counts and average IMDB ratings per director.',
    sql: `SELECT
    d.name AS director_name,
    COUNT(m.movie_id) AS total_films,
    ROUND(AVG(m.imdb_rating), 2) AS avg_rating,
    ROUND(AVG(m.runtime_minutes), 0) AS avg_runtime
FROM directors d
INNER JOIN movies m ON d.director_id = m.director_id
GROUP BY d.director_id, d.name
HAVING COUNT(m.movie_id) >= 2
ORDER BY avg_rating DESC;`,
  },
  {
    id: 'imdb-3',
    name: 'Lead Actor Film Roles',
    description: 'Retrieves actors and their film characters sorted by movie release year.',
    sql: `SELECT
    a.name AS actor_name,
    m.title AS movie_title,
    c.role_name,
    m.release_year,
    m.imdb_rating
FROM actors a
INNER JOIN cast_members c ON a.actor_id = c.actor_id
INNER JOIN movies m ON c.movie_id = m.movie_id
ORDER BY a.name ASC, m.release_year DESC;`,
  },
];
