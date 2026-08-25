import { SampleQuery } from './types';

export const classicmodelsSamples: SampleQuery[] = [
  {
    "id": "classicmodels-1",
    "name": "Sales Revenue by Product Line",
    "description": "Calculates gross product line revenue and order quantities.",
    "sql": "SELECT\n    p.product_line,\n    COUNT(DISTINCT od.order_number) AS total_orders,\n    SUM(od.quantity_ordered) AS total_units_sold,\n    ROUND(SUM(od.quantity_ordered * od.price_each), 2) AS total_sales\nFROM products p\nINNER JOIN order_details od ON p.product_code = od.product_code\nGROUP BY p.product_line\nORDER BY total_sales DESC;"
  },
  {
    "id": "classicmodels-2",
    "name": "Customer Account Balances and Payments",
    "description": "Aggregates payment volume and compares against credit limits.",
    "sql": "SELECT\n    c.customer_name,\n    c.country,\n    c.credit_limit,\n    ROUND(SUM(p.amount), 2) AS total_payments\nFROM customers c\nINNER JOIN payments p ON c.customer_number = p.customer_number\nGROUP BY c.customer_number, c.customer_name, c.country, c.credit_limit\nORDER BY total_payments DESC\nLIMIT 15;"
  },
  {
    "id": "classicmodels-3",
    "name": "High Value Orders Above Average",
    "description": "Finds individual order totals that exceed overall average order value.",
    "sql": "SELECT\n    order_number,\n    ROUND(SUM(quantity_ordered * price_each), 2) AS order_total\nFROM order_details\nGROUP BY order_number\nHAVING SUM(quantity_ordered * price_each) > (\n    SELECT AVG(order_total) FROM (\n        SELECT SUM(quantity_ordered * price_each) AS order_total\n        FROM order_details\n        GROUP BY order_number\n    )\n)\nORDER BY order_total DESC\nLIMIT 20;"
  },
  {
    "id": "classicmodels-4",
    "name": "Office Regional Sales CTE",
    "description": "Aggregates sales performance by regional office location.",
    "sql": "WITH office_sales AS (\n    SELECT\n        off.city AS office_city,\n        off.country AS office_country,\n        COUNT(DISTINCT o.order_number) AS orders_handled,\n        SUM(od.quantity_ordered * od.price_each) AS gross_sales\n    FROM offices off\n    INNER JOIN employees e ON off.office_code = e.office_code\n    INNER JOIN customers c ON e.employee_number = c.sales_rep_employee_number\n    INNER JOIN orders o ON c.customer_number = o.customer_number\n    INNER JOIN order_details od ON o.order_number = od.order_number\n    GROUP BY off.office_code, off.city, off.country\n)\nSELECT\n    office_city,\n    office_country,\n    orders_handled,\n    ROUND(gross_sales, 2) AS gross_sales\nFROM office_sales\nORDER BY gross_sales DESC;"
  },
  {
    "id": "classicmodels-5",
    "name": "Product Price Ranking by Scale",
    "description": "Ranks MSRP of scale models within each product line.",
    "sql": "SELECT\n    product_line,\n    product_name,\n    product_scale,\n    buy_price,\n    MSRP,\n    RANK() OVER (PARTITION BY product_line ORDER BY MSRP DESC) AS price_rank\nFROM products\nLIMIT 25;"
  },
  {
    "id": "classicmodels-6",
    "name": "Employee Sales Rep Client Counts",
    "description": "Summarizes client counts assigned per sales representative.",
    "sql": "SELECT\n    e.first_name || ' ' || e.last_name AS sales_rep,\n    e.job_title,\n    COUNT(c.customer_number) AS assigned_customers,\n    ROUND(AVG(c.credit_limit), 2) AS avg_client_credit_limit\nFROM employees e\nLEFT JOIN customers c ON e.employee_number = c.sales_rep_employee_number\nWHERE e.job_title LIKE '%Sales Rep%'\nGROUP BY e.employee_number, e.first_name, e.last_name, e.job_title\nORDER BY assigned_customers DESC;"
  },
  {
    "id": "classicmodels-7",
    "name": "Cumulative Customer Payments",
    "description": "Tracks cumulative payment inflow per customer over time.",
    "sql": "SELECT\n    customer_number,\n    payment_date,\n    amount,\n    SUM(amount) OVER (PARTITION BY customer_number ORDER BY payment_date) AS running_payment_total\nFROM payments\nORDER BY customer_number, payment_date\nLIMIT 30;"
  },
  {
    "id": "classicmodels-8",
    "name": "Insert New Customer (Add Data)",
    "description": "Inserts a new corporate wholesale customer.",
    "sql": "INSERT INTO customers (customer_number, customer_name, contact_last_name, contact_first_name, phone, city, country, credit_limit)\nVALUES (9901, 'Apex Collectibles', 'Vance', 'Arthur', '555-0199', 'Boston', 'USA', 75000.00);"
  },
  {
    "id": "classicmodels-9",
    "name": "Update Product Stock Quantity (Modify Data)",
    "description": "Restocks inventory for classic car models.",
    "sql": "UPDATE products\nSET quantity_in_stock = quantity_in_stock + 100\nWHERE product_line = 'Classic Cars' AND quantity_in_stock < 1000;"
  },
  {
    "id": "classicmodels-10",
    "name": "Delete Test Customer (Remove Data)",
    "description": "Removes the test wholesale customer account.",
    "sql": "DELETE FROM customers\nWHERE customer_number = 9901;"
  }
];
