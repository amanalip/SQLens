import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const imdbExpansion: SampleQuery[] = [
  sample('imdb-11', 'Consistently Rated Directors', 'Finds directors with several films and a strong minimum rating.', `SELECT d.name, COUNT(m.movie_id) AS films, ROUND(AVG(m.imdb_rating), 2) AS avg_rating,
       MIN(m.imdb_rating) AS lowest_rating
FROM directors d JOIN movies m ON d.director_id = m.director_id
GROUP BY d.director_id, d.name
HAVING COUNT(m.movie_id) >= 2
ORDER BY lowest_rating DESC, avg_rating DESC;`),
    sample('imdb-12', 'Recurring Screen Partnerships', 'Finds actor pairs credited together in more than one movie.', `SELECT a1.name AS actor_one, a2.name AS actor_two, COUNT(*) AS movies_together
FROM cast_members c1
JOIN cast_members c2 ON c1.movie_id = c2.movie_id AND c1.actor_id < c2.actor_id
JOIN actors a1 ON c1.actor_id = a1.actor_id
JOIN actors a2 ON c2.actor_id = a2.actor_id
GROUP BY c1.actor_id, c2.actor_id
HAVING COUNT(*) > 1
ORDER BY movies_together DESC;`),
    sample('imdb-13', 'Runtime Trends by Decade', 'Compares typical movie length and ratings across release decades.', `SELECT (release_year / 10) * 10 AS decade, COUNT(*) AS movies,
       ROUND(AVG(runtime_minutes), 1) AS avg_runtime,
       ROUND(AVG(imdb_rating), 2) AS avg_rating
FROM movies
WHERE runtime_minutes IS NOT NULL
GROUP BY decade
ORDER BY decade;`),
    ...profileSamples({ key: 'imdb', table: 'movies', subject: 'movies', value: 'imdb_rating', valueLabel: 'IMDb Ratings', category: 'release_year', categoryLabel: 'Release Year', id: 'movie_id' })
];
