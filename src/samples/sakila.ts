import { SampleQuery } from './chinook';

export const sakilaSamples: SampleQuery[] = [
  {
    id: 'sakila-1',
    name: 'Top Rented Films by Category',
    description: 'Finds film categories and counts total actors and catalog titles.',
    sql: `SELECT
    c.name AS category_name,
    COUNT(DISTINCT f.film_id) AS total_films,
    ROUND(AVG(f.rental_rate), 2) AS avg_rental_rate,
    ROUND(AVG(f.length), 0) AS avg_runtime_minutes
FROM categories c
INNER JOIN film_category fc ON c.category_id = fc.category_id
INNER JOIN films f ON fc.film_id = f.film_id
GROUP BY c.category_id, c.name
ORDER BY total_films DESC;`,
  },
  {
    id: 'sakila-2',
    name: 'Active Customer Payment History',
    description: 'Joins customers, rentals, and payments to track rental revenue per customer.',
    sql: `SELECT
    c.first_name,
    c.last_name,
    c.email,
    COUNT(r.rental_id) AS total_rentals,
    SUM(p.amount) AS total_paid
FROM customers c
INNER JOIN rentals r ON c.customer_id = r.customer_id
INNER JOIN payments p ON r.rental_id = p.rental_id
WHERE c.active = 1
GROUP BY c.customer_id, c.first_name, c.last_name, c.email
ORDER BY total_paid DESC;`,
  },
  {
    id: 'sakila-3',
    name: 'Unreturned Rentals',
    description: 'Finds open rental items with customer contact details.',
    sql: `SELECT
    r.rental_id,
    f.title AS film_title,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    r.rental_date
FROM rentals r
INNER JOIN films f ON r.film_id = f.film_id
INNER JOIN customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date ASC;`,
  },
  {
    id: 'sakila-4',
    name: 'Actor Collaboration Pairs',
    description: 'Finds pairs of actors who co-starred in the same film using a self-join.',
    sql: `SELECT
    a1.first_name || ' ' || a1.last_name AS actor_1,
    a2.first_name || ' ' || a2.last_name AS actor_2,
    f.title AS movie_title
FROM film_actor fa1
INNER JOIN film_actor fa2 ON fa1.film_id = fa2.film_id AND fa1.actor_id < fa2.actor_id
INNER JOIN actors a1 ON fa1.actor_id = a1.actor_id
INNER JOIN actors a2 ON fa2.actor_id = a2.actor_id
INNER JOIN films f ON fa1.film_id = f.film_id
ORDER BY f.title;`,
  },
];
