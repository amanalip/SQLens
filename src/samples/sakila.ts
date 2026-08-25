import { SampleQuery } from './types';

export const sakilaSamples: SampleQuery[] = [
  {
    "id": "sakila-1",
    "name": "Top Rented Films",
    "description": "Ranks films by rental frequency and total rental revenue generated.",
    "sql": "SELECT\n    f.title,\n    f.rating,\n    COUNT(r.rental_id) AS rental_count,\n    ROUND(SUM(p.amount), 2) AS total_revenue\nFROM films f\nINNER JOIN rentals r ON f.film_id = r.film_id\nINNER JOIN payments p ON r.rental_id = p.rental_id\nGROUP BY f.film_id, f.title, f.rating\nORDER BY total_revenue DESC\nLIMIT 10;"
  },
  {
    "id": "sakila-2",
    "name": "Revenue by Category",
    "description": "Aggregates gross rental fees per film genre.",
    "sql": "SELECT\n    c.name AS category_name,\n    COUNT(DISTINCT f.film_id) AS total_films,\n    COUNT(r.rental_id) AS total_rentals,\n    ROUND(SUM(p.amount), 2) AS gross_sales\nFROM categories c\nINNER JOIN film_category fc ON c.category_id = fc.category_id\nINNER JOIN films f ON fc.film_id = f.film_id\nINNER JOIN rentals r ON f.film_id = r.film_id\nINNER JOIN payments p ON r.rental_id = p.rental_id\nGROUP BY c.category_id, c.name\nORDER BY gross_sales DESC;"
  },
  {
    "id": "sakila-3",
    "name": "High Duration Action Films",
    "description": "Identifies action films longer than overall average runtime.",
    "sql": "SELECT\n    f.title,\n    f.length AS runtime_minutes,\n    f.rental_rate,\n    f.rating\nFROM films f\nINNER JOIN film_category fc ON f.film_id = fc.film_id\nINNER JOIN categories c ON fc.category_id = c.category_id\nWHERE c.name = 'Action'\n  AND f.length > (\n      SELECT AVG(length) FROM films\n  )\nORDER BY f.length DESC;"
  },
  {
    "id": "sakila-4",
    "name": "Active VIP Customers CTE",
    "description": "Extracts customer lifetime rental values and isolates frequent renters.",
    "sql": "WITH customer_stats AS (\n    SELECT\n        customer_id,\n        COUNT(rental_id) AS total_rentals,\n        SUM(amount) AS total_paid\n    FROM payments\n    GROUP BY customer_id\n)\nSELECT\n    c.first_name,\n    c.last_name,\n    c.email,\n    cs.total_rentals,\n    ROUND(cs.total_paid, 2) AS total_paid\nFROM customers c\nINNER JOIN customer_stats cs ON c.customer_id = cs.customer_id\nWHERE cs.total_rentals >= 30\nORDER BY cs.total_paid DESC;"
  },
  {
    "id": "sakila-5",
    "name": "Film Length Ranking by Rating",
    "description": "Ranks film lengths within each MPAA rating group using RANK().",
    "sql": "SELECT\n    rating,\n    title,\n    length,\n    RANK() OVER (PARTITION BY rating ORDER BY length DESC) AS length_rank\nFROM films\nLIMIT 30;"
  },
  {
    "id": "sakila-6",
    "name": "Actor Filmography Count and Rate",
    "description": "Summarizes film credits and average rental rates per actor.",
    "sql": "SELECT\n    a.first_name || ' ' || a.last_name AS actor_name,\n    COUNT(fa.film_id) AS films_count,\n    ROUND(AVG(f.rental_rate), 2) AS avg_rental_rate\nFROM actors a\nINNER JOIN film_actor fa ON a.actor_id = fa.actor_id\nINNER JOIN films f ON fa.film_id = f.film_id\nGROUP BY a.actor_id, a.first_name, a.last_name\nORDER BY films_count DESC\nLIMIT 15;"
  },
  {
    "id": "sakila-7",
    "name": "Customer Rental Payment Progression",
    "description": "Calculates cumulative payment progression per customer.",
    "sql": "SELECT\n    customer_id,\n    payment_id,\n    payment_date,\n    amount,\n    SUM(amount) OVER (PARTITION BY customer_id ORDER BY payment_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_paid\nFROM payments\nORDER BY customer_id, payment_date\nLIMIT 30;"
  },
  {
    "id": "sakila-8",
    "name": "Insert New Actor (Add Data)",
    "description": "Adds a new actor to the talent roster.",
    "sql": "INSERT INTO actors (actor_id, first_name, last_name)\nVALUES (9901, 'CLARA', 'OSWALD');"
  },
  {
    "id": "sakila-9",
    "name": "Update Film Rental Rates (Modify Data)",
    "description": "Updates rental rates for longer feature films.",
    "sql": "UPDATE films\nSET rental_rate = 4.99\nWHERE length > 175 AND rating = 'PG-13';"
  },
  {
    "id": "sakila-10",
    "name": "Delete Test Actor (Remove Data)",
    "description": "Removes the test actor record from the database.",
    "sql": "DELETE FROM actors\nWHERE actor_id = 9901;"
  }
];
