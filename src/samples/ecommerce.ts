import { SampleQuery } from './types';

export const ecommerceSamples: SampleQuery[] = [
  {
    "id": "ecommerce-1",
    "name": "Top Revenue Categories",
    "description": "Calculates gross merchandise value and items sold per product category.",
    "sql": "SELECT\n    p.category_name,\n    COUNT(oi.order_item_id) AS items_sold,\n    ROUND(SUM(oi.price), 2) AS gross_sales,\n    ROUND(AVG(oi.price), 2) AS avg_item_price\nFROM products p\nINNER JOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY p.category_name\nORDER BY gross_sales DESC;"
  },
  {
    "id": "ecommerce-2",
    "name": "Seller Sales Volume and Freight",
    "description": "Aggregates order counts and total freight handled per seller.",
    "sql": "SELECT\n    s.seller_name,\n    s.seller_city,\n    s.seller_state,\n    COUNT(oi.order_item_id) AS total_orders,\n    ROUND(SUM(oi.price), 2) AS total_revenue\nFROM sellers s\nINNER JOIN order_items oi ON s.seller_id = oi.seller_id\nGROUP BY s.seller_id, s.seller_name, s.seller_city, s.seller_state\nORDER BY total_revenue DESC\nLIMIT 15;"
  },
  {
    "id": "ecommerce-3",
    "name": "High Rated Products Above Average",
    "description": "Identifies orders with review scores higher than marketplace average.",
    "sql": "SELECT\n    o.order_id,\n    r.review_score,\n    r.review_comment,\n    oi.price\nFROM orders o\nINNER JOIN order_reviews r ON o.order_id = r.order_id\nINNER JOIN order_items oi ON o.order_id = oi.order_id\nWHERE r.review_score > (SELECT AVG(review_score) FROM order_reviews)\nORDER BY oi.price DESC\nLIMIT 20;"
  },
  {
    "id": "ecommerce-4",
    "name": "Customer Regional Spend CTE",
    "description": "Aggregates spending and item orders by customer geographic state.",
    "sql": "WITH state_spend AS (\n    SELECT\n        c.customer_state,\n        COUNT(DISTINCT o.order_id) AS total_orders,\n        SUM(oi.price) AS total_spent\n    FROM customers c\n    INNER JOIN orders o ON c.customer_id = o.customer_id\n    INNER JOIN order_items oi ON o.order_id = oi.order_id\n    GROUP BY c.customer_state\n)\nSELECT\n    customer_state,\n    total_orders,\n    ROUND(total_spent, 2) AS total_spent,\n    ROUND(total_spent / total_orders, 2) AS avg_order_value\nFROM state_spend\nORDER BY total_spent DESC;"
  },
  {
    "id": "ecommerce-5",
    "name": "Item Price Rank by Category",
    "description": "Ranks product prices within each category using DENSE_RANK().",
    "sql": "SELECT\n    category_name,\n    product_id,\n    weight_g,\n    RANK() OVER (PARTITION BY category_name ORDER BY weight_g DESC) AS weight_rank\nFROM products\nLIMIT 30;"
  },
  {
    "id": "ecommerce-6",
    "name": "Review Score Distribution Matrix",
    "description": "Summarizes order counts and review ratings breakdown.",
    "sql": "SELECT\n    review_score,\n    COUNT(review_id) AS total_reviews,\n    ROUND(COUNT(review_id) * 100.0 / (SELECT COUNT(*) FROM order_reviews), 1) AS pct_of_reviews\nFROM order_reviews\nGROUP BY review_score\nORDER BY review_score DESC;"
  },
  {
    "id": "ecommerce-7",
    "name": "Cumulative Order Revenue Stream",
    "description": "Computes cumulative sales volume over order timeline.",
    "sql": "SELECT\n    seller_id,\n    order_id,\n    price,\n    SUM(price) OVER (PARTITION BY seller_id ORDER BY order_id) AS cumulative_seller_sales\nFROM order_items\nLIMIT 25;"
  },
  {
    "id": "ecommerce-8",
    "name": "Insert New Product (Add Data)",
    "description": "Lists a new product catalog item.",
    "sql": "INSERT INTO products (product_id, category_name, name_length, description_length, photos_qty, weight_g)\nVALUES (9901, 'electronics', 45, 320, 4, 850);"
  },
  {
    "id": "ecommerce-9",
    "name": "Update Item Price (Modify Data)",
    "description": "Updates product price for special promotional clearance.",
    "sql": "UPDATE order_items\nSET price = ROUND(price * 0.90, 2)\nWHERE price > 200.00;"
  },
  {
    "id": "ecommerce-10",
    "name": "Delete Test Product (Remove Data)",
    "description": "Removes the test catalog listing.",
    "sql": "DELETE FROM products\nWHERE product_id = 9901;"
  }
];
