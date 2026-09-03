import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const food_deliveryExpansion: SampleQuery[] = [
  sample('food-delivery-11', 'Tipping by Cuisine', 'Compares tip rates and order sizes across restaurant cuisines.', `SELECT r.cuisine_type, COUNT(o.order_id) AS orders,
       ROUND(AVG(o.order_total), 2) AS avg_order,
       ROUND(100.0 * SUM(o.tip_amount) / NULLIF(SUM(o.order_total), 0), 1) AS tip_rate_pct
FROM restaurants r JOIN orders o ON r.restaurant_id = o.restaurant_id
GROUP BY r.cuisine_type
ORDER BY tip_rate_pct DESC;`),
    sample('food-delivery-12', 'Driver Speed and Ratings', 'Compares delivery times, tips, and customer ratings for each driver.', `SELECT d.first_name || ' ' || d.last_name AS driver, d.vehicle_type, d.rating,
       COUNT(o.order_id) AS deliveries, ROUND(AVG(o.delivery_time_minutes), 1) AS avg_minutes,
       ROUND(SUM(o.tip_amount), 2) AS tips
FROM drivers d LEFT JOIN orders o ON d.driver_id = o.driver_id
GROUP BY d.driver_id, driver, d.vehicle_type, d.rating
ORDER BY avg_minutes, d.rating DESC;`),
    sample('food-delivery-13', 'Repeat Customer Orders', 'Finds customers who have ordered more than once and totals their spending.', `SELECT c.first_name || ' ' || c.last_name AS customer, COUNT(o.order_id) AS orders,
       ROUND(SUM(o.order_total + o.delivery_fee + o.tip_amount), 2) AS total_spend
FROM customers c JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, customer
HAVING COUNT(o.order_id) > 1
ORDER BY total_spend DESC;`),
    ...profileSamples({ key: 'food-delivery', table: 'orders', subject: 'orders', value: 'order_total', valueLabel: 'Order Totals', category: 'order_status', categoryLabel: 'Order Status', id: 'order_id' })
];
