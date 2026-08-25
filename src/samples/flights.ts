import { SampleQuery } from './types';

export const flightsSamples: SampleQuery[] = [
  {
    "id": "flights-1",
    "name": "Airline Flight Volume and Delays",
    "description": "Calculates total flights and average arrival delays per airline.",
    "sql": "SELECT\n    a.airline_name,\n    a.iata_code,\n    COUNT(f.flight_id) AS total_flights,\n    ROUND(AVG(f.departure_delay_min), 1) AS avg_dep_delay,\n    ROUND(AVG(f.arrival_delay_min), 1) AS avg_arr_delay\nFROM airlines a\nLEFT JOIN flights f ON a.airline_id = f.airline_id\nGROUP BY a.airline_id, a.airline_name, a.iata_code\nORDER BY total_flights DESC;"
  },
  {
    "id": "flights-2",
    "name": "Airport Route Traffic Pairs",
    "description": "Analyzes flight frequencies between origin and destination airports.",
    "sql": "SELECT\n    orig.name AS origin_airport,\n    dest.name AS destination_airport,\n    COUNT(f.flight_id) AS flight_frequency,\n    ROUND(AVG(f.distance_miles), 0) AS avg_distance\nFROM flights f\nINNER JOIN airports orig ON f.origin_airport_id = orig.airport_id\nINNER JOIN airports dest ON f.dest_airport_id = dest.airport_id\nGROUP BY f.origin_airport_id, f.dest_airport_id, orig.name, dest.name\nORDER BY flight_frequency DESC\nLIMIT 15;"
  },
  {
    "id": "flights-3",
    "name": "Long Distance Flights Above Average",
    "description": "Finds flights with distance exceeding overall route average.",
    "sql": "SELECT\n    f.flight_number,\n    a.airline_name,\n    f.distance_miles,\n    f.status\nFROM flights f\nINNER JOIN airlines a ON f.airline_id = a.airline_id\nWHERE f.distance_miles > (SELECT AVG(distance_miles) FROM flights)\nORDER BY f.distance_miles DESC\nLIMIT 20;"
  },
  {
    "id": "flights-4",
    "name": "Airport Delay Metrics CTE",
    "description": "Aggregates departure delay metrics by origin airport hub.",
    "sql": "WITH hub_delays AS (\n    SELECT\n        ap.name AS airport_name,\n        ap.city,\n        COUNT(f.flight_id) AS departures,\n        AVG(f.departure_delay_min) AS avg_delay\n    FROM airports ap\n    INNER JOIN flights f ON ap.airport_id = f.origin_airport_id\n    GROUP BY ap.airport_id, ap.name, ap.city\n)\nSELECT\n    airport_name,\n    city,\n    departures,\n    ROUND(avg_delay, 1) AS avg_departure_delay_min\nFROM hub_delays\nORDER BY departures DESC;"
  },
  {
    "id": "flights-5",
    "name": "Flight Delay Rank by Airline",
    "description": "Ranks arrival delay lengths within each operating carrier.",
    "sql": "SELECT\n    airline_id,\n    flight_number,\n    arrival_delay_min,\n    RANK() OVER (PARTITION BY airline_id ORDER BY arrival_delay_min DESC) AS delay_rank\nFROM flights\nLIMIT 30;"
  },
  {
    "id": "flights-6",
    "name": "Flight Status Distribution Matrix",
    "description": "Breaks down flight operational statuses across schedule.",
    "sql": "SELECT\n    status,\n    COUNT(flight_id) AS total_flights,\n    ROUND(COUNT(flight_id) * 100.0 / (SELECT COUNT(*) FROM flights), 1) AS pct_of_flights\nFROM flights\nGROUP BY status;"
  },
  {
    "id": "flights-7",
    "name": "Cumulative Miles Flown by Carrier",
    "description": "Calculates running distance total per airline across flights.",
    "sql": "SELECT\n    airline_id,\n    flight_number,\n    distance_miles,\n    SUM(distance_miles) OVER (PARTITION BY airline_id ORDER BY flight_id) AS cumulative_miles\nFROM flights\nLIMIT 25;"
  },
  {
    "id": "flights-8",
    "name": "Insert New Airport (Add Data)",
    "description": "Adds a newly operational regional airport terminal.",
    "sql": "INSERT INTO airports (airport_id, iata_code, name, city, country, timezone)\nVALUES (9901, 'BER', 'Berlin Brandenburg Airport', 'Berlin', 'Germany', 'Europe/Berlin');"
  },
  {
    "id": "flights-9",
    "name": "Update Flight Status (Modify Data)",
    "description": "Updates status flags for delayed departures.",
    "sql": "UPDATE flights\nSET status = 'Delayed'\nWHERE departure_delay_min > 30;"
  },
  {
    "id": "flights-10",
    "name": "Delete Test Airport (Remove Data)",
    "description": "Removes the test airport record.",
    "sql": "DELETE FROM airports\nWHERE airport_id = 9901;"
  }
];
