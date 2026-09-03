import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const flightsExpansion: SampleQuery[] = [
  sample('flights-11', 'Route Delay Asymmetry', 'Compares average arrival delay in both directions between airport pairs.', `SELECT MIN(o.iata_code, d.iata_code) AS airport_one,
       MAX(o.iata_code, d.iata_code) AS airport_two,
       ROUND(AVG(CASE WHEN o.iata_code < d.iata_code THEN f.arrival_delay_min END), 1) AS forward_delay,
       ROUND(AVG(CASE WHEN o.iata_code > d.iata_code THEN f.arrival_delay_min END), 1) AS reverse_delay
FROM flights f
JOIN airports o ON f.origin_airport_id = o.airport_id
JOIN airports d ON f.dest_airport_id = d.airport_id
GROUP BY airport_one, airport_two
ORDER BY ABS(forward_delay - reverse_delay) DESC;`),
    sample('flights-12', 'Airline On Time Rate', 'Calculates the share of flights arriving within fifteen minutes of schedule.', `SELECT a.airline_name, COUNT(*) AS flights,
       ROUND(100.0 * SUM(CASE WHEN f.arrival_delay_min <= 15 THEN 1 ELSE 0 END) / COUNT(*), 1) AS on_time_pct
FROM flights f JOIN airlines a ON f.airline_id = a.airline_id
GROUP BY a.airline_id, a.airline_name
ORDER BY on_time_pct DESC;`),
    sample('flights-13', 'Busiest Connection Hubs', 'Counts departures and arrivals to identify the busiest airports.', `WITH movements AS (
    SELECT origin_airport_id AS airport_id FROM flights
    UNION ALL
    SELECT dest_airport_id FROM flights
)
SELECT a.iata_code, a.name, a.city, COUNT(*) AS flight_movements
FROM movements m JOIN airports a ON m.airport_id = a.airport_id
GROUP BY a.airport_id, a.iata_code, a.name, a.city
ORDER BY flight_movements DESC;`),
    ...profileSamples({ key: 'flights', table: 'flights', subject: 'flights', value: 'arrival_delay_min', valueLabel: 'Arrival Delays', category: 'status', categoryLabel: 'Flight Status', id: 'flight_id' })
];
