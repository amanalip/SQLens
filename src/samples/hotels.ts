import { SampleQuery } from './chinook';

export const hotelsSamples: SampleQuery[] = [
  {
    id: 'ht-1',
    name: 'Guest Bookings with Room Types and Nights Stayed',
    description: 'Lists hotel reservations with guest names, room categories, nightly rates, and stay duration.',
    sql: `SELECT
    b.booking_id,
    g.first_name || ' ' || g.last_name AS guest_name,
    h.name AS hotel_name,
    h.city,
    r.room_type,
    r.nightly_rate,
    b.check_in_date,
    b.check_out_date,
    b.total_amount
FROM bookings b
INNER JOIN guests g ON b.guest_id = g.guest_id
INNER JOIN rooms r ON b.room_id = r.room_id
INNER JOIN hotels h ON r.hotel_id = h.hotel_id
ORDER BY b.check_in_date DESC;`,
  },
  {
    id: 'ht-2',
    name: 'Hotel Revenue and Average Occupancy Rates',
    description: 'Aggregates booking counts, total revenue, and star ratings across hotel locations.',
    sql: `SELECT
    h.name AS hotel_name,
    h.city,
    h.star_rating,
    COUNT(b.booking_id) AS total_reservations,
    ROUND(SUM(b.total_amount), 2) AS total_revenue
FROM hotels h
INNER JOIN rooms r ON h.hotel_id = r.hotel_id
LEFT JOIN bookings b ON r.room_id = b.room_id
GROUP BY h.hotel_id, h.name, h.city, h.star_rating
ORDER BY total_revenue DESC;`,
  },
  {
    id: 'ht-3',
    name: 'Guest Lifetime Value and Repeat Visits CTE',
    description: 'Ranks top guests by booking frequencies and cumulative spend using CTEs.',
    sql: `WITH guest_history AS (
    SELECT
        guest_id,
        COUNT(booking_id) AS stay_count,
        ROUND(SUM(total_amount), 2) AS lifetime_spend
    FROM bookings
    WHERE status = 'completed'
    GROUP BY guest_id
)
SELECT
    g.first_name || ' ' || g.last_name AS guest_name,
    g.country,
    gh.stay_count,
    gh.lifetime_spend
FROM guests g
INNER JOIN guest_history gh ON g.guest_id = gh.guest_id
ORDER BY gh.lifetime_spend DESC;`,
  },
];
