import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const ecommerceExpansion: SampleQuery[] = [
  sample('ecommerce-11', 'Delivery Speed and Reviews', 'Compares customer ratings with the number of days taken to deliver.', `SELECT r.review_score,
       ROUND(AVG(julianday(o.delivered_timestamp) - julianday(o.purchase_timestamp)), 1) AS avg_delivery_days,
       COUNT(*) AS reviewed_orders
FROM orders o JOIN order_reviews r ON o.order_id = r.order_id
WHERE o.delivered_timestamp IS NOT NULL
GROUP BY r.review_score
ORDER BY r.review_score;`),
    sample('ecommerce-12', 'Freight Heavy Categories', 'Finds product categories where shipping is a large share of item cost.', `SELECT p.category_name, COUNT(*) AS items,
       ROUND(AVG(oi.freight_value * 100.0 / NULLIF(oi.price, 0)), 1) AS avg_freight_pct
FROM order_items oi JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category_name
ORDER BY avg_freight_pct DESC;`),
    sample('ecommerce-13', 'Seller Category Breadth', 'Ranks sellers by the number of product categories they have fulfilled.', `SELECT s.seller_name, s.seller_state, COUNT(DISTINCT p.category_name) AS categories,
       COUNT(oi.order_item_id) AS items_sold
FROM sellers s
JOIN order_items oi ON s.seller_id = oi.seller_id
JOIN products p ON oi.product_id = p.product_id
GROUP BY s.seller_id, s.seller_name, s.seller_state
ORDER BY categories DESC, items_sold DESC;`),
    ...profileSamples({ key: 'ecommerce', table: 'order_items', subject: 'order items', value: 'price', valueLabel: 'Item Prices', category: 'seller_id', categoryLabel: 'Seller', id: 'order_item_id' })
];
