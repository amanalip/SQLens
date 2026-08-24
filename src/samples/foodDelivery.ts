import { SampleQuery } from './chinook';

export const foodDeliverySamples: SampleQuery[] = [
  {
    id: 'fd-1',
    name: 'Customer Orders with Restaurant and Driver Details',
    description: 'Retrieves completed orders with restaurant cuisine, delivery duration, and courier information.',
    sql: `SELECT
    o.order_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    r.name AS restaurant_name,
    r.cuisine_type,
    d.first_name || ' ' || d.last_name AS driver_name,
    o.order_total,
    o.delivery_fee,
    o.tip_amount,
    o.delivery_time_minutes
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
LEFT JOIN drivers d ON o.driver_id = d.driver_id
ORDER BY o.order_timestamp DESC;`,
  },
  {
    id: 'fd-2',
    name: 'Restaurant Revenue and Customer Rating Averages',
    description: 'Calculates order totals, net restaurant revenue, and average star ratings by cuisine.',
    sql: `SELECT
    r.cuisine_type,
    COUNT(DISTINCT r.restaurant_id) AS restaurant_count,
    COUNT(o.order_id) AS total_orders,
    ROUND(AVG(r.rating), 2) AS avg_restaurant_rating,
    ROUND(SUM(o.order_total), 2) AS gross_sales
FROM restaurants r
INNER JOIN orders o ON r.restaurant_id = o.restaurant_id
GROUP BY r.cuisine_type
ORDER BY gross_sales DESC;`,
  },
  {
    id: 'fd-3',
    name: 'Driver Delivery Earnings Summary CTE',
    description: 'Computes courier completed deliveries, tip earnings, and speed averages using CTEs.',
    sql: `WITH driver_deliveries AS (
    SELECT
        driver_id,
        COUNT(order_id) AS completed_trips,
        ROUND(SUM(delivery_fee), 2) AS total_delivery_fees,
        ROUND(SUM(tip_amount), 2) AS total_tips,
        ROUND(AVG(delivery_time_minutes), 1) AS avg_delivery_minutes
    FROM orders
    WHERE order_status = 'delivered' AND driver_id IS NOT NULL
    GROUP BY driver_id
)
SELECT
    d.first_name || ' ' || d.last_name AS driver_name,
    d.vehicle_type,
    dd.completed_trips,
    ROUND(dd.total_delivery_fees + dd.total_tips, 2) AS total_payout,
    dd.avg_delivery_minutes
FROM drivers d
INNER JOIN driver_deliveries dd ON d.driver_id = dd.driver_id
ORDER BY total_payout DESC;`,
  },
];
