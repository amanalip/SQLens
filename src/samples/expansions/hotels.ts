import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const hotelsExpansion: SampleQuery[] = [
  sample('hotels-11', 'Effective Nightly Booking Rates', 'Compares booked nightly prices with each room listed rate.', `SELECT h.name AS hotel, r.room_type, b.booking_id,
       julianday(b.check_out_date) - julianday(b.check_in_date) AS nights,
       ROUND(b.total_amount / NULLIF(julianday(b.check_out_date) - julianday(b.check_in_date), 0), 2) AS booked_nightly_rate,
       r.nightly_rate AS listed_rate
FROM bookings b JOIN hotels h ON b.hotel_id = h.hotel_id
JOIN rooms r ON b.room_id = r.room_id
ORDER BY booked_nightly_rate DESC;`),
    sample('hotels-12', 'Guest Travel Corridors', 'Counts visits from guest countries to hotel destination countries.', `SELECT g.country AS guest_country, h.country AS destination_country,
       COUNT(*) AS bookings, ROUND(SUM(b.total_amount), 2) AS revenue
FROM bookings b JOIN guests g ON b.guest_id = g.guest_id
JOIN hotels h ON b.hotel_id = h.hotel_id
WHERE g.country <> h.country
GROUP BY g.country, h.country
ORDER BY bookings DESC, revenue DESC;`),
    sample('hotels-13', 'Rooms With No Booking History', 'Finds hotel rooms that have never been reserved.', `SELECT h.name AS hotel, r.room_id, r.room_type, r.nightly_rate, r.max_occupancy
FROM rooms r JOIN hotels h ON r.hotel_id = h.hotel_id
LEFT JOIN bookings b ON r.room_id = b.room_id
GROUP BY r.room_id, h.name, r.room_type, r.nightly_rate, r.max_occupancy
HAVING COUNT(b.booking_id) = 0
ORDER BY h.name, r.nightly_rate DESC;`),
    ...profileSamples({ key: 'hotels', table: 'bookings', subject: 'bookings', value: 'total_amount', valueLabel: 'Booking Values', category: 'status', categoryLabel: 'Booking Status', id: 'booking_id' })
];
