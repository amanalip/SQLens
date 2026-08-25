import { SampleQuery } from './types';

export const hotelsSamples: SampleQuery[] = [
  {
    "id": "hotels-1",
    "name": "Hotel Revenue and Star Ratings",
    "description": "Calculates total booking revenue and guest stays by hotel property.",
    "sql": "SELECT\n    h.name AS hotel_name,\n    h.city,\n    h.country,\n    h.star_rating,\n    COUNT(b.booking_id) AS total_bookings,\n    ROUND(SUM(b.total_amount), 2) AS gross_booking_revenue\nFROM hotels h\nLEFT JOIN bookings b ON h.hotel_id = b.hotel_id\nGROUP BY h.hotel_id, h.name, h.city, h.country, h.star_rating\nORDER BY gross_booking_revenue DESC;"
  },
  {
    "id": "hotels-2",
    "name": "Room Rates and Occupancy Capacities",
    "description": "Lists room types, nightly rates, and capacity limits per hotel.",
    "sql": "SELECT\n    h.name AS hotel_name,\n    r.room_type,\n    r.nightly_rate,\n    r.max_occupancy,\n    COUNT(b.booking_id) AS bookings_count\nFROM rooms r\nINNER JOIN hotels h ON r.hotel_id = h.hotel_id\nLEFT JOIN bookings b ON r.room_id = b.room_id\nGROUP BY r.room_id, h.name, r.room_type, r.nightly_rate, r.max_occupancy\nORDER BY r.nightly_rate DESC\nLIMIT 15;"
  },
  {
    "id": "hotels-3",
    "name": "High Value Bookings Above Average",
    "description": "Finds reservations where total amount spent exceeds hotel chain average.",
    "sql": "SELECT\n    b.booking_id,\n    h.name AS hotel_name,\n    g.first_name || ' ' || g.last_name AS guest_name,\n    b.check_in_date,\n    b.check_out_date,\n    b.total_amount\nFROM bookings b\nINNER JOIN hotels h ON b.hotel_id = h.hotel_id\nINNER JOIN guests g ON b.guest_id = g.guest_id\nWHERE b.total_amount > (SELECT AVG(total_amount) FROM bookings)\nORDER BY b.total_amount DESC\nLIMIT 20;"
  },
  {
    "id": "hotels-4",
    "name": "City Hospitality Revenue CTE",
    "description": "Aggregates hospitality revenue and hotel counts by destination city.",
    "sql": "WITH city_performance AS (\n    SELECT\n        h.city,\n        h.country,\n        COUNT(DISTINCT h.hotel_id) AS hotel_count,\n        SUM(b.total_amount) AS total_revenue\n    FROM hotels h\n    LEFT JOIN bookings b ON h.hotel_id = b.hotel_id\n    GROUP BY h.city, h.country\n)\nSELECT\n    city,\n    country,\n    hotel_count,\n    ROUND(total_revenue, 2) AS total_revenue\nFROM city_performance\nORDER BY total_revenue DESC;"
  },
  {
    "id": "hotels-5",
    "name": "Nightly Rate Rank by Hotel",
    "description": "Ranks room nightly rates within each hotel.",
    "sql": "SELECT\n    hotel_id,\n    room_type,\n    nightly_rate,\n    RANK() OVER (PARTITION BY hotel_id ORDER BY nightly_rate DESC) AS rate_rank\nFROM rooms\nLIMIT 30;"
  },
  {
    "id": "hotels-6",
    "name": "Booking Status Breakdown",
    "description": "Summarizes reservation volumes across confirmation statuses.",
    "sql": "SELECT\n    status,\n    COUNT(booking_id) AS booking_count,\n    ROUND(SUM(total_amount), 2) AS total_volume\nFROM bookings\nGROUP BY status;"
  },
  {
    "id": "hotels-7",
    "name": "Cumulative Guest Spend Tracking",
    "description": "Calculates running expenditure per guest over reservation history.",
    "sql": "SELECT\n    guest_id,\n    booking_id,\n    total_amount,\n    SUM(total_amount) OVER (PARTITION BY guest_id ORDER BY booking_id) AS cumulative_guest_spend\nFROM bookings\nLIMIT 25;"
  },
  {
    "id": "hotels-8",
    "name": "Insert New Hotel (Add Data)",
    "description": "Adds a newly opened luxury boutique resort.",
    "sql": "INSERT INTO hotels (hotel_id, name, city, country, star_rating)\nVALUES (9901, 'Azure Bay Resort', 'Nice', 'France', 5);"
  },
  {
    "id": "hotels-9",
    "name": "Update Room Rates (Modify Data)",
    "description": "Applies seasonal rate adjustment to luxury suites.",
    "sql": "UPDATE rooms\nSET nightly_rate = ROUND(nightly_rate * 1.15, 2)\nWHERE room_type LIKE '%Suite%';"
  },
  {
    "id": "hotels-10",
    "name": "Delete Test Hotel (Remove Data)",
    "description": "Removes the test resort entry.",
    "sql": "DELETE FROM hotels\nWHERE hotel_id = 9901;"
  }
];
