import { SampleQuery } from '../types';
import { sample } from './helpers';

export const sakilaExpansion: SampleQuery[] = [
  sample('sakila-11', 'Rentals Still Outstanding', 'Lists films that have been rented but not returned.', `SELECT r.rental_id, f.title, c.first_name || ' ' || c.last_name AS customer, r.rental_date
FROM rentals r
JOIN films f ON r.film_id = f.film_id
JOIN customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL
ORDER BY r.rental_date;`),
    sample('sakila-12', 'Frequent Actor Pairings', 'Finds actor pairs who have appeared in multiple films together.', `SELECT a1.first_name || ' ' || a1.last_name AS actor_one,
       a2.first_name || ' ' || a2.last_name AS actor_two,
       COUNT(*) AS films_together
FROM film_actor fa1
JOIN film_actor fa2 ON fa1.film_id = fa2.film_id AND fa1.actor_id < fa2.actor_id
JOIN actors a1 ON fa1.actor_id = a1.actor_id
JOIN actors a2 ON fa2.actor_id = a2.actor_id
GROUP BY fa1.actor_id, fa2.actor_id
HAVING COUNT(*) > 1
ORDER BY films_together DESC;`),
    sample('sakila-13', 'Rental Demand by Rating', 'Compares film inventory and rental activity across content ratings.', `SELECT f.rating, COUNT(DISTINCT f.film_id) AS film_count, COUNT(r.rental_id) AS rental_count,
       ROUND(COUNT(r.rental_id) * 1.0 / COUNT(DISTINCT f.film_id), 2) AS rentals_per_film
FROM films f
LEFT JOIN rentals r ON f.film_id = r.film_id
GROUP BY f.rating
ORDER BY rentals_per_film DESC;`),
    sample('sakila-14', 'Customer Rental Gaps', 'Measures days between rentals for repeat customers.', `WITH history AS (SELECT customer_id, rental_date, LAG(rental_date) OVER (PARTITION BY customer_id ORDER BY rental_date) AS prior_rental FROM rentals) SELECT c.first_name || ' ' || c.last_name AS customer, ROUND(AVG(julianday(h.rental_date) - julianday(h.prior_rental)), 1) AS avg_gap_days FROM history h JOIN customers c ON h.customer_id = c.customer_id GROUP BY h.customer_id, customer ORDER BY avg_gap_days;`),
    sample('sakila-15', 'Category Revenue', 'Totals rental payments by film category.', `SELECT c.name AS category, COUNT(DISTINCT r.rental_id) AS rentals, ROUND(SUM(p.amount), 2) AS revenue FROM categories c JOIN film_category fc ON c.category_id = fc.category_id JOIN rentals r ON fc.film_id = r.film_id JOIN payments p ON r.rental_id = p.rental_id GROUP BY c.category_id, c.name ORDER BY revenue DESC;`),
    sample('sakila-16', 'Longest Unreturned Rentals', 'Ranks open rentals by the time elapsed since checkout.', `SELECT r.rental_id, f.title, c.first_name || ' ' || c.last_name AS customer, CAST(julianday('now') - julianday(r.rental_date) AS INTEGER) AS days_out FROM rentals r JOIN films f ON r.film_id = f.film_id JOIN customers c ON r.customer_id = c.customer_id WHERE r.return_date IS NULL ORDER BY days_out DESC;`),
    sample('sakila-17', 'Actor Film Count Ranking', 'Ranks actors by the size of their filmography.', `SELECT a.first_name || ' ' || a.last_name AS actor, COUNT(fa.film_id) AS films, DENSE_RANK() OVER (ORDER BY COUNT(fa.film_id) DESC) AS filmography_rank FROM actors a LEFT JOIN film_actor fa ON a.actor_id = fa.actor_id GROUP BY a.actor_id, actor ORDER BY filmography_rank;`),
    sample('sakila-18', 'Rental Rate Sweet Spot', 'Compares rental volume across price points.', `SELECT f.rental_rate, COUNT(DISTINCT f.film_id) AS films, COUNT(r.rental_id) AS rentals, ROUND(COUNT(r.rental_id) * 1.0 / COUNT(DISTINCT f.film_id), 2) AS rentals_per_film FROM films f LEFT JOIN rentals r ON f.film_id = r.film_id GROUP BY f.rental_rate ORDER BY rentals_per_film DESC;`),
    sample('sakila-19', 'Inactive Customer Revenue', 'Compares lifetime payment totals for inactive customers.', `SELECT c.customer_id, c.first_name || ' ' || c.last_name AS customer, COUNT(p.payment_id) AS payments, ROUND(COALESCE(SUM(p.amount), 0), 2) AS lifetime_value FROM customers c LEFT JOIN payments p ON c.customer_id = p.customer_id WHERE c.active = 0 GROUP BY c.customer_id, customer ORDER BY lifetime_value DESC;`),
    sample('sakila-20', 'Film Length Buckets', 'Groups films by runtime and compares ratings and rental demand.', `SELECT CASE WHEN f.length < 60 THEN 'Short' WHEN f.length < 120 THEN 'Standard' ELSE 'Long' END AS runtime_group, COUNT(DISTINCT f.film_id) AS films, COUNT(r.rental_id) AS rentals, ROUND(AVG(f.rental_rate), 2) AS avg_rate FROM films f LEFT JOIN rentals r ON f.film_id = r.film_id GROUP BY runtime_group ORDER BY films DESC;`),
];
