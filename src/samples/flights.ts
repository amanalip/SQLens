import { SampleQuery } from './chinook';

export const flightsSamples: SampleQuery[] = [
  {
    id: 'fl-1',
    name: 'Scheduled Flights with Origin and Destination Airports',
    description: 'Lists flights with airline carriers, route distances, and departure terminals.',
    sql: `SELECT
    f.flight_number,
    al.airline_name,
    orig.iata_code AS origin,
    orig.city AS origin_city,
    dest.iata_code AS destination,
    dest.city AS dest_city,
    f.scheduled_departure,
    f.distance_miles
FROM flights f
INNER JOIN airlines al ON f.airline_id = al.airline_id
INNER JOIN airports orig ON f.origin_airport_id = orig.airport_id
INNER JOIN airports dest ON f.dest_airport_id = dest.airport_id
ORDER BY f.scheduled_departure ASC;`,
  },
  {
    id: 'fl-2',
    name: 'Airline Delay Performance and Cancellation Rates',
    description: 'Computes average departure delays and on-time percentages by airline.',
    sql: `SELECT
    al.airline_name,
    COUNT(f.flight_id) AS total_flights,
    ROUND(AVG(f.departure_delay_min), 1) AS avg_dep_delay_min,
    ROUND(AVG(f.arrival_delay_min), 1) AS avg_arr_delay_min,
    SUM(CASE WHEN f.status = 'cancelled' THEN 1 ELSE 0 END) AS cancellations
FROM airlines al
INNER JOIN flights f ON al.airline_id = f.airline_id
GROUP BY al.airline_id, al.airline_name
ORDER BY avg_dep_delay_min ASC;`,
  },
  {
    id: 'fl-3',
    name: 'Busiest Airport Route Pairs CTE',
    description: 'Identifies top airport pairs by total flight volume and average seat capacity.',
    sql: `WITH route_stats AS (
    SELECT
        origin_airport_id,
        dest_airport_id,
        COUNT(flight_id) AS flight_count,
        ROUND(AVG(distance_miles), 0) AS route_distance
    FROM flights
    GROUP BY origin_airport_id, dest_airport_id
)
SELECT
    orig.iata_code || ' -> ' || dest.iata_code AS route,
    orig.name AS origin_airport,
    dest.name AS dest_airport,
    rs.flight_count,
    rs.route_distance
FROM route_stats rs
INNER JOIN airports orig ON rs.origin_airport_id = orig.airport_id
INNER JOIN airports dest ON rs.dest_airport_id = dest.airport_id
ORDER BY rs.flight_count DESC;`,
  },
];
