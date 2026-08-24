export interface SampleQuery {
  id: string;
  name: string;
  description: string;
  sql: string;
}

export const chinookSamples: SampleQuery[] = [
  {
    id: 'chinook-1',
    name: 'Top Selling Artists',
    description: 'Calculates total sales revenue per artist using multi-table joins and aggregations.',
    sql: `SELECT
    ar.name AS artist_name,
    COUNT(ii.invoice_line_id) AS tracks_sold,
    ROUND(SUM(ii.unit_price * ii.quantity), 2) AS total_revenue
FROM artists ar
INNER JOIN albums al ON ar.artist_id = al.artist_id
INNER JOIN tracks t ON al.album_id = t.album_id
INNER JOIN invoice_items ii ON t.track_id = ii.track_id
GROUP BY ar.artist_id, ar.name
ORDER BY total_revenue DESC;`,
  },
  {
    id: 'chinook-2',
    name: 'Customer Spending by Country',
    description: 'Groups invoice totals by country and filters for higher revenue regions.',
    sql: `SELECT
    c.country,
    COUNT(DISTINCT c.customer_id) AS total_customers,
    COUNT(i.invoice_id) AS total_orders,
    ROUND(SUM(i.total), 2) AS gross_sales
FROM customers c
INNER JOIN invoices i ON c.customer_id = i.customer_id
GROUP BY c.country
HAVING SUM(i.total) > 5.00
ORDER BY gross_sales DESC;`,
  },
  {
    id: 'chinook-3',
    name: 'Track Durations Above Average',
    description: 'Finds rock tracks that are longer than the overall genre average using a subquery.',
    sql: `SELECT
    t.name AS track_name,
    t.milliseconds / 1000 AS duration_seconds,
    t.unit_price
FROM tracks t
INNER JOIN genres g ON t.genre_id = g.genre_id
WHERE g.name = 'Rock'
  AND t.milliseconds > (
      SELECT AVG(milliseconds) FROM tracks
  )
ORDER BY t.milliseconds DESC;`,
  },
  {
    id: 'chinook-4',
    name: 'High Spender CTE',
    description: 'Isolates customers with multiple purchases and aggregates their invoice counts.',
    sql: `WITH customer_orders AS (
    SELECT
        customer_id,
        COUNT(invoice_id) AS order_count,
        SUM(total) AS total_spent
    FROM invoices
    GROUP BY customer_id
)
SELECT
    c.first_name,
    c.last_name,
    c.email,
    co.order_count,
    co.total_spent
FROM customers c
INNER JOIN customer_orders co ON c.customer_id = co.customer_id
ORDER BY co.total_spent DESC;`,
  },
];
