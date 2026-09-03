import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const chinookExpansion: SampleQuery[] = [
  sample('chinook-11', 'Customers Without Purchases', 'Finds customer accounts that have never placed an order.', `SELECT c.customer_id, c.first_name, c.last_name, c.country
FROM customers c
LEFT JOIN invoices i ON c.customer_id = i.customer_id
WHERE i.invoice_id IS NULL
ORDER BY c.last_name, c.first_name;`),
    sample('chinook-12', 'Most Versatile Composers', 'Compares composers by track count and the number of genres in their catalog.', `SELECT t.composer, COUNT(*) AS track_count, COUNT(DISTINCT t.genre_id) AS genre_count
FROM tracks t
WHERE t.composer IS NOT NULL
GROUP BY t.composer
HAVING COUNT(*) >= 2
ORDER BY genre_count DESC, track_count DESC
LIMIT 20;`),
    sample('chinook-13', 'Monthly Revenue Changes', 'Shows monthly sales and the change from the previous month.', `WITH monthly_sales AS (
    SELECT substr(invoice_date, 1, 7) AS month, SUM(total) AS revenue
    FROM invoices
    GROUP BY substr(invoice_date, 1, 7)
)
SELECT month, ROUND(revenue, 2) AS revenue,
       ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change_from_prior_month
FROM monthly_sales
ORDER BY month;`),
    sample('chinook-14', 'Support Rep Sales Load', 'Compares customer count and sales handled by each support representative.', `SELECT c.support_rep_id, COUNT(DISTINCT c.customer_id) AS customers, COUNT(i.invoice_id) AS invoices, ROUND(SUM(i.total), 2) AS sales FROM customers c LEFT JOIN invoices i ON c.customer_id = i.customer_id GROUP BY c.support_rep_id ORDER BY sales DESC;`),
    sample('chinook-15', 'Albums With No Sales', 'Finds albums whose tracks have never appeared on an invoice.', `SELECT ar.name AS artist, al.title AS album FROM albums al JOIN artists ar ON al.artist_id = ar.artist_id LEFT JOIN tracks t ON al.album_id = t.album_id LEFT JOIN invoice_items ii ON t.track_id = ii.track_id GROUP BY al.album_id, ar.name, al.title HAVING COUNT(ii.invoice_line_id) = 0 ORDER BY artist, album;`),
    sample('chinook-16', 'Media Format Revenue', 'Totals unit sales and revenue for each media format.', `SELECT mt.name AS media_format, SUM(ii.quantity) AS units, ROUND(SUM(ii.unit_price * ii.quantity), 2) AS revenue FROM media_types mt JOIN tracks t ON mt.media_type_id = t.media_type_id JOIN invoice_items ii ON t.track_id = ii.track_id GROUP BY mt.media_type_id, mt.name ORDER BY revenue DESC;`),
    sample('chinook-17', 'Customer Order Gaps', 'Measures the longest gap between purchases for each customer.', `WITH dated AS (SELECT customer_id, invoice_date, LAG(invoice_date) OVER (PARTITION BY customer_id ORDER BY invoice_date) AS prior_date FROM invoices) SELECT customer_id, MAX(julianday(invoice_date) - julianday(prior_date)) AS longest_gap_days FROM dated GROUP BY customer_id ORDER BY longest_gap_days DESC;`),
    sample('chinook-18', 'Genre Revenue Share', 'Calculates each genre share of total track revenue.', `SELECT g.name AS genre, ROUND(SUM(ii.unit_price * ii.quantity), 2) AS revenue, ROUND(100.0 * SUM(ii.unit_price * ii.quantity) / SUM(SUM(ii.unit_price * ii.quantity)) OVER (), 2) AS revenue_pct FROM genres g JOIN tracks t ON g.genre_id = t.genre_id JOIN invoice_items ii ON t.track_id = ii.track_id GROUP BY g.genre_id, g.name ORDER BY revenue DESC;`),
    sample('chinook-19', 'Longest Albums', 'Ranks albums by their combined track duration.', `SELECT ar.name AS artist, al.title AS album, COUNT(t.track_id) AS tracks, ROUND(SUM(t.milliseconds) / 60000.0, 1) AS minutes FROM albums al JOIN artists ar ON al.artist_id = ar.artist_id JOIN tracks t ON al.album_id = t.album_id GROUP BY al.album_id, ar.name, al.title ORDER BY minutes DESC LIMIT 20;`),
    sample('chinook-20', 'Cross Border Customers', 'Finds customers whose billing country differs across invoices.', `SELECT c.first_name || ' ' || c.last_name AS customer, c.country AS home_country, COUNT(DISTINCT i.billing_country) AS billing_countries FROM customers c JOIN invoices i ON c.customer_id = i.customer_id GROUP BY c.customer_id, customer, c.country HAVING COUNT(DISTINCT i.billing_country) > 1 ORDER BY billing_countries DESC;`),
];
