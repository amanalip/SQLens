import { SampleQuery } from './chinook';

export const ecommerceSamples: SampleQuery[] = [
  {
    id: 'ecom-1',
    name: 'Customer Orders by State and Category',
    description: 'Retrieves order items joined with customer locations and product categories.',
    sql: `SELECT
    c.customer_state,
    p.category_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.price) AS total_sales
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
GROUP BY c.customer_state, p.category_name
ORDER BY total_sales DESC;`,
  },
  {
    id: 'ecom-2',
    name: 'Top Rated Product Categories',
    description: 'Computes review score averages and order item counts per product category.',
    sql: `SELECT
    p.category_name,
    COUNT(oi.order_item_id) AS items_sold,
    ROUND(AVG(r.review_score), 2) AS avg_review_score,
    ROUND(AVG(oi.price), 2) AS avg_price
FROM products p
INNER JOIN order_items oi ON p.product_id = oi.product_id
INNER JOIN order_reviews r ON oi.order_id = r.order_id
GROUP BY p.category_name
HAVING COUNT(oi.order_item_id) >= 2
ORDER BY avg_review_score DESC, items_sold DESC;`,
  },
  {
    id: 'ecom-3',
    name: 'Seller Fulfillment Performance CTE',
    description: 'Measures seller order volume, revenue, and average customer review ratings.',
    sql: `WITH seller_metrics AS (
    SELECT
        oi.seller_id,
        COUNT(oi.order_item_id) AS total_items_shipped,
        ROUND(SUM(oi.price), 2) AS total_revenue,
        ROUND(AVG(r.review_score), 2) AS seller_rating
    FROM order_items oi
    INNER JOIN order_reviews r ON oi.order_id = r.order_id
    GROUP BY oi.seller_id
)
SELECT
    s.seller_name,
    s.seller_city,
    s.seller_state,
    sm.total_items_shipped,
    sm.total_revenue,
    sm.seller_rating
FROM sellers s
INNER JOIN seller_metrics sm ON s.seller_id = sm.seller_id
ORDER BY sm.total_revenue DESC;`,
  },
];
