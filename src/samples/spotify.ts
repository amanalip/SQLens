import { SampleQuery } from './chinook';

export const spotifySamples: SampleQuery[] = [
  {
    id: 'spotify-1',
    name: 'Top Energy and Danceable Tracks',
    description: 'Finds upbeat tracks with high danceability and energy levels.',
    sql: `SELECT
    t.track_name,
    a.artist_name,
    al.album_name,
    t.danceability,
    t.energy,
    t.tempo,
    t.popularity
FROM tracks t
INNER JOIN artists a ON t.artist_id = a.artist_id
INNER JOIN albums al ON t.album_id = al.album_id
WHERE t.danceability > 0.70 AND t.energy > 0.70
ORDER BY t.popularity DESC;`,
  },
  {
    id: 'spotify-2',
    name: 'Artist Audio Profiles Average',
    description: 'Computes average track attributes per musical artist.',
    sql: `SELECT
    a.artist_name,
    COUNT(t.track_id) AS track_count,
    ROUND(AVG(t.danceability), 2) AS avg_danceability,
    ROUND(AVG(t.energy), 2) AS avg_energy,
    ROUND(AVG(t.valence), 2) AS avg_valence,
    ROUND(AVG(t.tempo), 1) AS avg_tempo
FROM artists a
INNER JOIN tracks t ON a.artist_id = t.artist_id
GROUP BY a.artist_id, a.artist_name
ORDER BY track_count DESC, avg_danceability DESC;`,
  },
  {
    id: 'spotify-3',
    name: 'Acoustic vs Electronic Classification CASE',
    description: 'Categorizes tracks into acoustic or electronic styles based on audio attributes.',
    sql: `SELECT
    t.track_name,
    a.artist_name,
    t.acousticness,
    t.energy,
    CASE
        WHEN t.acousticness >= 0.60 THEN 'Acoustic / Organic'
        WHEN t.energy >= 0.75 THEN 'High Energy / Electronic'
        ELSE 'Balanced'
    END AS track_style
FROM tracks t
INNER JOIN artists a ON t.artist_id = a.artist_id
ORDER BY t.popularity DESC;`,
  },
];
