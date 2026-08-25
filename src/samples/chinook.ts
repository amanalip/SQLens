import { SampleQuery } from './types';

export const chinookSamples: SampleQuery[] = [
  {
    "id": "chinook-1",
    "name": "Top Selling Artists",
    "description": "Calculates total sales revenue per artist using multi-table joins and aggregations.",
    "sql": "SELECT\n    ar.name AS artist_name,\n    COUNT(ii.invoice_line_id) AS tracks_sold,\n    ROUND(SUM(ii.unit_price * ii.quantity), 2) AS total_revenue\nFROM artists ar\nINNER JOIN albums al ON ar.artist_id = al.artist_id\nINNER JOIN tracks t ON al.album_id = t.album_id\nINNER JOIN invoice_items ii ON t.track_id = ii.track_id\nGROUP BY ar.artist_id, ar.name\nORDER BY total_revenue DESC;"
  },
  {
    "id": "chinook-2",
    "name": "Customer Spending by Country",
    "description": "Groups invoice totals by country and filters for higher revenue regions.",
    "sql": "SELECT\n    c.country,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    COUNT(i.invoice_id) AS total_orders,\n    ROUND(SUM(i.total), 2) AS gross_sales\nFROM customers c\nINNER JOIN invoices i ON c.customer_id = i.customer_id\nGROUP BY c.country\nHAVING SUM(i.total) > 5.00\nORDER BY gross_sales DESC;"
  },
  {
    "id": "chinook-3",
    "name": "Track Durations Above Average",
    "description": "Finds rock tracks that are longer than the overall genre average using a subquery.",
    "sql": "SELECT\n    t.name AS track_name,\n    t.milliseconds / 1000 AS duration_seconds,\n    t.unit_price\nFROM tracks t\nINNER JOIN genres g ON t.genre_id = g.genre_id\nWHERE g.name = 'Rock'\n  AND t.milliseconds > (\n      SELECT AVG(milliseconds) FROM tracks\n  )\nORDER BY t.milliseconds DESC;"
  },
  {
    "id": "chinook-4",
    "name": "High Spender CTE",
    "description": "Isolates customers with multiple purchases and aggregates their invoice counts.",
    "sql": "WITH customer_orders AS (\n    SELECT\n        customer_id,\n        COUNT(invoice_id) AS order_count,\n        SUM(total) AS total_spent\n    FROM invoices\n    GROUP BY customer_id\n)\nSELECT\n    c.first_name,\n    c.last_name,\n    c.email,\n    co.order_count,\n    co.total_spent\nFROM customers c\nINNER JOIN customer_orders co ON c.customer_id = co.customer_id\nORDER BY co.total_spent DESC;"
  },
  {
    "id": "chinook-5",
    "name": "Album Track Duration Ranking",
    "description": "Ranks tracks within each album by length using window functions.",
    "sql": "SELECT\n    al.title AS album_title,\n    t.name AS track_name,\n    t.milliseconds / 1000 AS seconds,\n    RANK() OVER (PARTITION BY t.album_id ORDER BY t.milliseconds DESC) AS duration_rank\nFROM tracks t\nINNER JOIN albums al ON t.album_id = al.album_id\nLIMIT 30;"
  },
  {
    "id": "chinook-6",
    "name": "Genre Track Inventory and Pricing",
    "description": "Summarizes track inventory and average pricing by genre.",
    "sql": "SELECT\n    g.name AS genre_name,\n    COUNT(t.track_id) AS total_tracks,\n    ROUND(AVG(t.unit_price), 2) AS avg_unit_price,\n    ROUND(SUM(t.bytes) / (1024.0 * 1024.0), 2) AS total_mb\nFROM genres g\nLEFT JOIN tracks t ON g.genre_id = t.genre_id\nGROUP BY g.genre_id, g.name\nORDER BY total_tracks DESC;"
  },
  {
    "id": "chinook-7",
    "name": "Cumulative Customer Invoicing",
    "description": "Computes cumulative spend for each customer over time.",
    "sql": "SELECT\n    customer_id,\n    invoice_id,\n    invoice_date,\n    total,\n    SUM(total) OVER (PARTITION BY customer_id ORDER BY invoice_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_spend\nFROM invoices\nORDER BY customer_id, invoice_date\nLIMIT 25;"
  },
  {
    "id": "chinook-8",
    "name": "Insert New Artist (Add Data)",
    "description": "Inserts a new musical artist into the database.",
    "sql": "INSERT INTO artists (artist_id, name)\nVALUES (9901, 'Horizon Echoes');"
  },
  {
    "id": "chinook-9",
    "name": "Update Customer Company (Modify Data)",
    "description": "Updates corporate affiliation for customer record.",
    "sql": "UPDATE customers\nSET company = 'Innovatech Corp'\nWHERE customer_id = 1;"
  },
  {
    "id": "chinook-10",
    "name": "Delete Test Artist (Remove Data)",
    "description": "Deletes the test artist record from the database.",
    "sql": "DELETE FROM artists\nWHERE artist_id = 9901;"
  }
];
