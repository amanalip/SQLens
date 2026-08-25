import { SampleQuery } from './types';

export const foodDeliverySamples: SampleQuery[] = [
  {
    "id": "food-delivery-1",
    "name": "Restaurant Sales and Ratings",
    "description": "Calculates total order revenue and average order value by restaurant.",
    "sql": "SELECT\n    r.name AS restaurant_name,\n    r.cuisine_type,\n    r.rating,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.order_total), 2) AS gross_sales,\n    ROUND(AVG(o.order_total), 2) AS avg_order_value\nFROM restaurants r\nINNER JOIN orders o ON r.restaurant_id = o.restaurant_id\nGROUP BY r.restaurant_id, r.name, r.cuisine_type, r.rating\nORDER BY gross_sales DESC;"
  },
  {
    "id": "food-delivery-2",
    "name": "Courier Delivery Earnings and Tips",
    "description": "Aggregates delivery deliveries and tip income earned by drivers.",
    "sql": "SELECT\n    d.first_name || ' ' || d.last_name AS driver_name,\n    d.vehicle_type,\n    d.rating AS driver_rating,\n    COUNT(o.order_id) AS completed_deliveries,\n    ROUND(SUM(o.tip_amount), 2) AS total_tips,\n    ROUND(AVG(o.delivery_time_minutes), 1) AS avg_delivery_time\nFROM drivers d\nINNER JOIN orders o ON d.driver_id = o.driver_id\nGROUP BY d.driver_id, d.first_name, d.last_name, d.vehicle_type, d.rating\nORDER BY completed_deliveries DESC;"
  },
  {
    "id": "food-delivery-3",
    "name": "High Value Orders Above Average",
    "description": "Finds orders where order total exceeds overall platform average.",
    "sql": "SELECT\n    o.order_id,\n    r.name AS restaurant_name,\n    o.order_total,\n    o.delivery_fee,\n    o.tip_amount\nFROM orders o\nINNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id\nWHERE o.order_total > (SELECT AVG(order_total) FROM orders)\nORDER BY o.order_total DESC\nLIMIT 20;"
  },
  {
    "id": "food-delivery-4",
    "name": "Cuisine Popularity CTE",
    "description": "Summarizes order counts and total spent across cuisine categories.",
    "sql": "WITH cuisine_totals AS (\n    SELECT\n        r.cuisine_type,\n        COUNT(o.order_id) AS order_count,\n        SUM(o.order_total) AS total_revenue\n    FROM restaurants r\n    INNER JOIN orders o ON r.restaurant_id = o.restaurant_id\n    GROUP BY r.cuisine_type\n)\nSELECT\n    cuisine_type,\n    order_count,\n    ROUND(total_revenue, 2) AS total_revenue,\n    ROUND(total_revenue / order_count, 2) AS avg_ticket_size\nFROM cuisine_totals\nORDER BY total_revenue DESC;"
  },
  {
    "id": "food-delivery-5",
    "name": "Order Total Rank by Cuisine",
    "description": "Ranks individual orders within each cuisine type.",
    "sql": "SELECT\n    r.cuisine_type,\n    o.order_id,\n    o.order_total,\n    RANK() OVER (PARTITION BY r.cuisine_type ORDER BY o.order_total DESC) AS cuisine_order_rank\nFROM orders o\nINNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id\nLIMIT 30;"
  },
  {
    "id": "food-delivery-6",
    "name": "Driver Vehicle Distribution",
    "description": "Summarizes courier vehicle types and rating averages.",
    "sql": "SELECT\n    vehicle_type,\n    COUNT(driver_id) AS driver_count,\n    ROUND(AVG(rating), 2) AS avg_driver_rating\nFROM drivers\nGROUP BY vehicle_type;"
  },
  {
    "id": "food-delivery-7",
    "name": "Cumulative Daily Restaurant Sales",
    "description": "Computes running sales total per restaurant.",
    "sql": "SELECT\n    restaurant_id,\n    order_id,\n    order_total,\n    SUM(order_total) OVER (PARTITION BY restaurant_id ORDER BY order_id) AS cumulative_sales\nFROM orders\nLIMIT 25;"
  },
  {
    "id": "food-delivery-8",
    "name": "Insert New Restaurant (Add Data)",
    "description": "Registers a new partner restaurant kitchen.",
    "sql": "INSERT INTO restaurants (restaurant_id, name, cuisine_type, address, rating)\nVALUES (9901, 'Artisan Ramen Bar', 'Japanese', '500 Pine St', 4.8);"
  },
  {
    "id": "food-delivery-9",
    "name": "Update Restaurant Rating (Modify Data)",
    "description": "Updates customer satisfaction score for popular cafe.",
    "sql": "UPDATE restaurants\nSET rating = 4.9\nWHERE restaurant_id = 1;"
  },
  {
    "id": "food-delivery-10",
    "name": "Delete Test Restaurant (Remove Data)",
    "description": "Removes the test kitchen profile.",
    "sql": "DELETE FROM restaurants\nWHERE restaurant_id = 9901;"
  }
];
