import { SampleQuery } from './types';

export const spotifySamples: SampleQuery[] = [
  {
    "id": "spotify-1",
    "name": "Top Popular Tracks",
    "description": "Lists tracks with highest popularity scores and audio features.",
    "sql": "SELECT\n    t.track_name,\n    a.artist_name,\n    al.album_name,\n    t.popularity,\n    t.danceability,\n    t.energy\nFROM tracks t\nINNER JOIN artists a ON t.artist_id = a.artist_id\nINNER JOIN albums al ON t.album_id = al.album_id\nORDER BY t.popularity DESC\nLIMIT 15;"
  },
  {
    "id": "spotify-2",
    "name": "Artist Monthly Listeners and Catalog",
    "description": "Aggregates track counts and average song energy per musical artist.",
    "sql": "SELECT\n    a.artist_name,\n    a.genre,\n    a.monthly_listeners,\n    COUNT(t.track_id) AS total_tracks,\n    ROUND(AVG(t.popularity), 1) AS avg_track_popularity\nFROM artists a\nLEFT JOIN tracks t ON a.artist_id = t.artist_id\nGROUP BY a.artist_id, a.artist_name, a.genre, a.monthly_listeners\nORDER BY a.monthly_listeners DESC;"
  },
  {
    "id": "spotify-3",
    "name": "Upbeat High Tempo Tracks",
    "description": "Finds danceable tracks with tempo and energy above catalog averages.",
    "sql": "SELECT\n    track_name,\n    tempo,\n    danceability,\n    energy\nFROM tracks\nWHERE danceability > (SELECT AVG(danceability) FROM tracks)\n  AND energy > (SELECT AVG(energy) FROM tracks)\nORDER BY tempo DESC\nLIMIT 20;"
  },
  {
    "id": "spotify-4",
    "name": "Album Acoustic Profile CTE",
    "description": "Classifies albums by acousticness and danceability index.",
    "sql": "WITH album_metrics AS (\n    SELECT\n        al.album_name,\n        a.artist_name,\n        AVG(t.danceability) AS avg_dance,\n        AVG(t.energy) AS avg_energy,\n        COUNT(t.track_id) AS track_count\n    FROM albums al\n    INNER JOIN artists a ON al.artist_id = a.artist_id\n    INNER JOIN tracks t ON al.album_id = t.album_id\n    GROUP BY al.album_id, al.album_name, a.artist_name\n)\nSELECT\n    album_name,\n    artist_name,\n    ROUND(avg_dance, 2) AS avg_danceability,\n    ROUND(avg_energy, 2) AS avg_energy,\n    track_count\nFROM album_metrics\nORDER BY avg_danceability DESC;"
  },
  {
    "id": "spotify-5",
    "name": "Track Popularity Rank by Artist",
    "description": "Ranks song popularity within each artist catalog using RANK().",
    "sql": "SELECT\n    artist_id,\n    track_name,\n    popularity,\n    RANK() OVER (PARTITION BY artist_id ORDER BY popularity DESC) AS artist_track_rank\nFROM tracks\nLIMIT 30;"
  },
  {
    "id": "spotify-6",
    "name": "Tempo Distribution and Key Metrics",
    "description": "Summarizes audio metrics segmented by tempo range tiers.",
    "sql": "SELECT\n    CASE\n        WHEN tempo >= 130 THEN 'Fast (>130 BPM)'\n        WHEN tempo >= 100 THEN 'Medium (100-130 BPM)'\n        ELSE 'Slow (<100 BPM)'\n    END AS tempo_bracket,\n    COUNT(track_id) AS song_count,\n    ROUND(AVG(danceability), 2) AS avg_dance,\n    ROUND(AVG(energy), 2) AS avg_energy\nFROM tracks\nGROUP BY tempo_bracket\nORDER BY song_count DESC;"
  },
  {
    "id": "spotify-7",
    "name": "Cumulative Duration by Album",
    "description": "Calculates running playback duration in milliseconds across album tracks.",
    "sql": "SELECT\n    album_id,\n    track_name,\n    duration_ms,\n    SUM(duration_ms) OVER (PARTITION BY album_id ORDER BY track_id) AS cumulative_ms\nFROM tracks\nLIMIT 25;"
  },
  {
    "id": "spotify-8",
    "name": "Insert New Track (Add Data)",
    "description": "Adds a newly produced track into the catalog.",
    "sql": "INSERT INTO tracks (track_id, track_name, artist_id, album_id, duration_ms, danceability, energy, valence, tempo, acousticness, popularity)\nVALUES (9901, 'Neon Sunset', 1, 1, 210000, 0.78, 0.85, 0.65, 124.0, 0.12, 75);"
  },
  {
    "id": "spotify-9",
    "name": "Update Artist Listeners (Modify Data)",
    "description": "Updates monthly listener totals for viral artists.",
    "sql": "UPDATE artists\nSET monthly_listeners = monthly_listeners + 500000\nWHERE genre = 'Pop';"
  },
  {
    "id": "spotify-10",
    "name": "Delete Test Track (Remove Data)",
    "description": "Removes the test track entry.",
    "sql": "DELETE FROM tracks\nWHERE track_id = 9901;"
  }
];
