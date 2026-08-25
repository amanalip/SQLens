import { SampleQuery } from './types';

export const imdbSamples: SampleQuery[] = [
  {
    "id": "imdb-1",
    "name": "Top Rated Movies by Director",
    "description": "Lists highest rated films and director details.",
    "sql": "SELECT\n    m.title,\n    m.release_year,\n    m.imdb_rating,\n    m.meta_score,\n    d.name AS director_name\nFROM movies m\nINNER JOIN directors d ON m.director_id = d.director_id\nWHERE m.imdb_rating >= 8.5\nORDER BY m.imdb_rating DESC, m.meta_score DESC;"
  },
  {
    "id": "imdb-2",
    "name": "Genre Film Statistics",
    "description": "Calculates film count and average ratings per genre.",
    "sql": "SELECT\n    g.name AS genre_name,\n    COUNT(mg.movie_id) AS total_movies,\n    ROUND(AVG(m.imdb_rating), 2) AS avg_rating,\n    ROUND(AVG(m.runtime_minutes), 1) AS avg_runtime\nFROM genres g\nINNER JOIN movie_genres mg ON g.genre_id = mg.genre_id\nINNER JOIN movies m ON mg.movie_id = m.movie_id\nGROUP BY g.genre_id, g.name\nORDER BY total_movies DESC;"
  },
  {
    "id": "imdb-3",
    "name": "Directors with Above Average Output",
    "description": "Finds directors whose movies exceed average IMDb rating.",
    "sql": "SELECT\n    d.name AS director_name,\n    COUNT(m.movie_id) AS film_count,\n    ROUND(AVG(m.imdb_rating), 2) AS avg_director_rating\nFROM directors d\nINNER JOIN movies m ON d.director_id = m.director_id\nGROUP BY d.director_id, d.name\nHAVING AVG(m.imdb_rating) > (\n    SELECT AVG(imdb_rating) FROM movies\n)\nORDER BY avg_director_rating DESC;"
  },
  {
    "id": "imdb-4",
    "name": "Decade Movie Performance CTE",
    "description": "Aggregates movie production and critical acclaim by release decade.",
    "sql": "WITH movie_decades AS (\n    SELECT\n        (release_year / 10) * 10 AS decade,\n        imdb_rating,\n        runtime_minutes\n    FROM movies\n)\nSELECT\n    decade || 's' AS decade_name,\n    COUNT(*) AS total_films,\n    ROUND(AVG(imdb_rating), 2) AS avg_rating,\n    ROUND(AVG(runtime_minutes), 0) AS avg_runtime\nFROM movie_decades\nGROUP BY decade\nORDER BY decade ASC;"
  },
  {
    "id": "imdb-5",
    "name": "Movie Rating Rank by Release Year",
    "description": "Ranks film ratings within each release year.",
    "sql": "SELECT\n    release_year,\n    title,\n    imdb_rating,\n    RANK() OVER (PARTITION BY release_year ORDER BY imdb_rating DESC) AS year_rank\nFROM movies\nLIMIT 30;"
  },
  {
    "id": "imdb-6",
    "name": "Actor Cast Appearances",
    "description": "Summarizes film credits and primary billing roles for actors.",
    "sql": "SELECT\n    a.name AS actor_name,\n    COUNT(cm.movie_id) AS total_roles,\n    MIN(cm.billing_order) AS highest_billing\nFROM actors a\nINNER JOIN cast_members cm ON a.actor_id = cm.actor_id\nGROUP BY a.actor_id, a.name\nORDER BY total_roles DESC\nLIMIT 15;"
  },
  {
    "id": "imdb-7",
    "name": "Cumulative Films by Director",
    "description": "Computes cumulative film releases per director ordered chronologically.",
    "sql": "SELECT\n    director_id,\n    title,\n    release_year,\n    COUNT(movie_id) OVER (PARTITION BY director_id ORDER BY release_year ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS career_film_number\nFROM movies\nORDER BY director_id, release_year\nLIMIT 30;"
  },
  {
    "id": "imdb-8",
    "name": "Insert New Movie (Add Data)",
    "description": "Inserts a new feature film entry.",
    "sql": "INSERT INTO movies (movie_id, title, release_year, runtime_minutes, imdb_rating, meta_score, director_id)\nVALUES (9901, 'Quantum Odyssey', 2024, 142, 8.4, 86, 1);"
  },
  {
    "id": "imdb-9",
    "name": "Update Movie Rating (Modify Data)",
    "description": "Updates IMDb score for a classic film.",
    "sql": "UPDATE movies\nSET imdb_rating = 8.9\nWHERE movie_id = 1;"
  },
  {
    "id": "imdb-10",
    "name": "Delete Test Movie (Remove Data)",
    "description": "Removes the test film entry from catalog.",
    "sql": "DELETE FROM movies\nWHERE movie_id = 9901;"
  }
];
