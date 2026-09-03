import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const spotifyExpansion: SampleQuery[] = [
  sample('spotify-11', 'Track Mood Quadrants', 'Classifies tracks by their energy and valence profile.', `SELECT track_name, energy, valence,
       CASE WHEN energy >= 0.6 AND valence >= 0.6 THEN 'Bright and energetic'
            WHEN energy >= 0.6 THEN 'Intense'
            WHEN valence >= 0.6 THEN 'Warm and relaxed'
            ELSE 'Low key' END AS mood
FROM tracks
ORDER BY popularity DESC;`),
    sample('spotify-12', 'Most Consistent Albums', 'Finds albums whose tracks have the smallest spread in popularity.', `SELECT al.album_name, ar.artist_name, COUNT(t.track_id) AS tracks,
       MAX(t.popularity) - MIN(t.popularity) AS popularity_spread
FROM albums al
JOIN artists ar ON al.artist_id = ar.artist_id
JOIN tracks t ON al.album_id = t.album_id
GROUP BY al.album_id, al.album_name, ar.artist_name
HAVING COUNT(t.track_id) >= 2
ORDER BY popularity_spread, tracks DESC;`),
    sample('spotify-13', 'Artists Beating Their Own Average', 'Lists each artist tracks that outperform the rest of their catalog.', `SELECT ar.artist_name, t.track_name, t.popularity
FROM tracks t JOIN artists ar ON t.artist_id = ar.artist_id
WHERE t.popularity > (
    SELECT AVG(t2.popularity) FROM tracks t2 WHERE t2.artist_id = t.artist_id
)
ORDER BY ar.artist_name, t.popularity DESC;`),
    ...profileSamples({ key: 'spotify', table: 'tracks', subject: 'tracks', value: 'popularity', valueLabel: 'Popularity', category: 'artist_id', categoryLabel: 'Artist', id: 'track_id' })
];
