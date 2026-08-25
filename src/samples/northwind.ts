import { SampleQuery } from './types';

export const northwindSamples: SampleQuery[] = [
  {
    "id": "northwind-1",
    "name": "Top Selling Products by Revenue",
    "description": "Calculates gross product revenue across orders considering discount rates.",
    "sql": "SELECT\n    p.product_name,\n    c.category_name,\n    ROUND(SUM(od.unit_price * od.quantity * (1 - od.discount)), 2) AS total_revenue\nFROM products p\nINNER JOIN categories c ON p.category_id = c.category_id\nINNER JOIN order_details od ON p.product_id = od.product_id\nGROUP BY p.product_id, p.product_name, c.category_name\nORDER BY total_revenue DESC\nLIMIT 10;"
  },
  {
    "id": "northwind-2",
    "name": "Employee Sales Performance",
    "description": "Analyzes order count and freight managed per employee.",
    "sql": "SELECT\n    e.first_name || ' ' || e.last_name AS employee_name,\n    e.title,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.freight), 2) AS total_freight\nFROM employees e\nLEFT JOIN orders o ON e.employee_id = o.employee_id\nGROUP BY e.employee_id, e.first_name, e.last_name, e.title\nORDER BY total_orders DESC;"
  },
  {
    "id": "northwind-3",
    "name": "Low Stock Products Alert",
    "description": "Finds products where inventory is below supplier reorder threshold using subqueries.",
    "sql": "SELECT\n    p.product_name,\n    p.units_in_stock,\n    s.company_name AS supplier_name,\n    s.country\nFROM products p\nINNER JOIN suppliers s ON p.supplier_id = s.supplier_id\nWHERE p.units_in_stock < (\n    SELECT AVG(units_in_stock) FROM products\n)\n  AND p.discontinued = 0\nORDER BY p.units_in_stock ASC;"
  },
  {
    "id": "northwind-4",
    "name": "Customer High Value Orders CTE",
    "description": "Aggregates spending per customer and isolates top tier commercial accounts.",
    "sql": "WITH customer_spend AS (\n    SELECT\n        o.customer_id,\n        COUNT(DISTINCT o.order_id) AS total_orders,\n        SUM(od.unit_price * od.quantity * (1 - od.discount)) AS gross_spent\n    FROM orders o\n    INNER JOIN order_details od ON o.order_id = od.order_id\n    GROUP BY o.customer_id\n)\nSELECT\n    c.company_name,\n    c.city,\n    c.country,\n    cs.total_orders,\n    ROUND(cs.gross_spent, 2) AS gross_spent\nFROM customers c\nINNER JOIN customer_spend cs ON c.customer_id = cs.customer_id\nORDER BY cs.gross_spent DESC\nLIMIT 15;"
  },
  {
    "id": "northwind-5",
    "name": "Product Price Ranking by Category",
    "description": "Ranks products by unit price within each category using DENSE_RANK.",
    "sql": "SELECT\n    c.category_name,\n    p.product_name,\n    p.unit_price,\n    DENSE_RANK() OVER (PARTITION BY p.category_id ORDER BY p.unit_price DESC) AS price_rank\nFROM products p\nINNER JOIN categories c ON p.category_id = c.category_id\nORDER BY c.category_name, price_rank\nLIMIT 25;"
  },
  {
    "id": "northwind-6",
    "name": "Supplier Product Inventory Matrix",
    "description": "Breaks down active catalog count and total stock units by supplier.",
    "sql": "SELECT\n    s.company_name AS supplier,\n    s.country,\n    COUNT(p.product_id) AS product_count,\n    SUM(p.units_in_stock) AS total_units_in_stock\nFROM suppliers s\nLEFT JOIN products p ON s.supplier_id = p.supplier_id\nGROUP BY s.supplier_id, s.company_name, s.country\nORDER BY total_units_in_stock DESC;"
  },
  {
    "id": "northwind-7",
    "name": "Order Freight Moving Average",
    "description": "Calculates 3-order moving average freight cost per customer.",
    "sql": "SELECT\n    order_id,\n    customer_id,\n    order_date,\n    freight,\n    ROUND(AVG(freight) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS moving_avg_freight\nFROM orders\nLIMIT 30;"
  },
  {
    "id": "northwind-8",
    "name": "Insert New Product (Add Data)",
    "description": "Inserts a new product into the catalog.",
    "sql": "INSERT INTO products (product_id, product_name, supplier_id, category_id, unit_price, units_in_stock, discontinued)\nVALUES (9901, 'Artisan Olive Oil', 1, 2, 18.50, 45, 0);"
  },
  {
    "id": "northwind-9",
    "name": "Update Product Price (Modify Data)",
    "description": "Applies price adjustment to dairy products with ample stock.",
    "sql": "UPDATE products\nSET unit_price = ROUND(unit_price * 1.05, 2)\nWHERE category_id = 4 AND units_in_stock > 20;"
  },
  {
    "id": "northwind-10",
    "name": "Delete Test Product (Remove Data)",
    "description": "Deletes the test product from the catalog.",
    "sql": "DELETE FROM products\nWHERE product_id = 9901;"
  }
];
